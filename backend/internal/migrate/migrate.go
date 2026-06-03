package migrate

import (
	"database/sql"
	"fmt"
	"os"
	"path/filepath"
	"sort"
)

func Run(db *sql.DB) error {
	files, err := filepath.Glob("db/migrations/*.up.sql")
	if err != nil {
		return err
	}

	sort.Strings(files)

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