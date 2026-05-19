package url

import "time"

type URL struct {
	ID        string    `json:"id"`
	URL       string    `json:"url"`
	UserID    string    `json:"user_id"`
	CreatedAt time.Time `json:"created_at"`
}
