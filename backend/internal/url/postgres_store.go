package url

import (
	"database/sql"

	_ "github.com/lib/pq"
)

type PostgresStore struct {
	db *sql.DB
}

func NewPostgresStore(connStr string) (*PostgresStore, error) {
	db, err := sql.Open("postgres", connStr)

	if err != nil {
		return nil, err
	}

	err = db.Ping()
	if err != nil {
		return nil, err
	}

	return &PostgresStore{db: db}, nil
}

func (p *PostgresStore) Save(url URL) error {
	query := `insert into urls (id, original_url) values ($1,$2)`
	_, err := p.db.Exec(query, url.ID, url.URL)
	return err
}

func (p *PostgresStore) Get(id string) (URL, bool) {
	query := `select id,original_url from urls where id=$1`
	row := p.db.QueryRow(query, id)

	var url URL
	err := row.Scan(&url.ID, &url.URL, &url.CreatedAt)

	if err != nil {
		return URL{}, false
	}

	return url, true
}

func (p *PostgresStore) GetByURL(original string) (URL, bool) {
	query := `select id,original_url from urls where original_url=$1`
	row := p.db.QueryRow(query, original)

	var url URL
	err := row.Scan(&url.ID, &url.URL, &url.CreatedAt)

	if err != nil {
		return URL{}, false
	}
	return url, true
}
