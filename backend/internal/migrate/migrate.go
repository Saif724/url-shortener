package migrate

import (
	"database/sql"
	"fmt"
	"os"
	"path/filepath"
)

func Run(db *sql.DB) error {
	files, err := filepath.Glob("db/migrations/*.sql")
	if err != nil {
		return err
	}

	for _, file:= range files {
		content, err := os.ReadFile(file)
		if err != nil {
			return err
		}

		_, err = db.Exec(string(content))
		if err != nil {
			return fmt.Errorf("migration failed %s: %w", file, err)
		}
	}

	return nil
}