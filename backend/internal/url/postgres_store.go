package url

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	_ "github.com/jackc/pgx/v5/stdlib"
)

type PostgresStore struct {
	db *sql.DB
}

func NewPostgresStore(connStr string) (*PostgresStore, error) {
	db, err := sql.Open("pgx", connStr)
	if err != nil {
		return nil, err
	}

	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(25)
	db.SetConnMaxLifetime(5 * time.Minute)

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	err = db.PingContext(ctx)
	if err != nil {
		return nil, err
	}

	return &PostgresStore{db: db}, nil
}

func (ps *PostgresStore) DB() *sql.DB {
	return ps.db
}

func (p *PostgresStore) Save(url URL) error {
	query := `insert into urls (id, original_url, user_id) values ($1,$2, $3)`
	_, err := p.db.Exec(query, url.ID, url.URL, url.UserID)
	return err
}

func (p *PostgresStore) Get(id string) (URL, bool) {
	query := `select id,original_url, user_id, created_at from urls where id=$1`
	row := p.db.QueryRow(query, id)

	var url URL
	err := row.Scan(&url.ID, &url.URL, &url.UserID, &url.CreatedAt)

	if err != nil {
		if err == sql.ErrNoRows {
			return URL{}, false
		}

		fmt.Println("DB ERROR:", err)
		return URL{}, false
	}

	return url, true
}

func (p *PostgresStore) GetByURLAndUser(originalURL string, userID string) (URL, bool) {
	query := `select id,original_url, user_id, created_at from urls where original_url=$1 and user_id=$2`
	row := p.db.QueryRow(query, originalURL, userID)

	var url URL
	err := row.Scan(&url.ID, &url.URL, &url.UserID, &url.CreatedAt)

	if err != nil {
		if err == sql.ErrNoRows {
			return URL{}, false
		}

		fmt.Println("DB ERROR:", err)
		return URL{}, false
	}
	return url, true
}

func (p *PostgresStore) GetByUserID(userID string) ([]URL, error) {
	query := `select id, original_url, user_id, created_at from urls where user_id=$1 order by created_at desc`
	rows, err := p.db.Query(query, userID)

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var urls []URL
	for rows.Next() {
		var url URL
		err := rows.Scan(&url.ID, &url.URL, &url.UserID, &url.CreatedAt)
		if err != nil {
			return nil, err
		}
		urls = append(urls, url)
	}

	return urls, nil
}

func (p *PostgresStore) Delete(id string) error {
	query := `delete from urls where id=$1`
	_, err := p.db.Exec(query, id)
	return err
}

func (p *PostgresStore) GetByURL(original string) (URL, bool) {
	query := `select id,original_url,user_id, created_at from urls where original_url=$1`
	row := p.db.QueryRow(query, original)

	var url URL
	err := row.Scan(&url.ID, &url.URL, &url.UserID, &url.CreatedAt)

	if err != nil {
		if err == sql.ErrNoRows {
			return URL{}, false
		}

		fmt.Println("DB ERROR:", err)
		return URL{}, false
	}
	return url, true
}
