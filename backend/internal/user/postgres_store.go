package user

import (
	"database/sql"
	"fmt"
)

type PostgresUserStore struct {
	db *sql.DB
}

func NewPostgresUserStore(db *sql.DB) *PostgresUserStore {
	return &PostgresUserStore{
		db: db,
	}
}

func (ps *PostgresUserStore) SaveUser(user User) error {
	query := `INSERT INTO users (id,email,password_hash) VALUES($1,$2,$3)`
	_, err := ps.db.Exec(query, user.ID, user.Email, user.Password)

	if err != nil {
		if err.Error() == "pq: duplicate key value violates constraint \"users_email_key\"" {
			return fmt.Errorf("email already exists")
		}
		return err
	}
	return nil
}

func (ps *PostgresUserStore) GetUserByEmail(email string) (User, error) {
	query := `SELECT id, email, password_hash FROM users WHERE email=$1`
	row := ps.db.QueryRow(query, email)

	var user User
	err := row.Scan(&user.ID, &user.Email, &user.Password)
	if err != nil {
		if err == sql.ErrNoRows {
			return User{}, fmt.Errorf("user not found")
		}
		return User{}, err
	}
	return user, nil
}
