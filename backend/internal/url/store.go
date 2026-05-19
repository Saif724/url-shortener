package url

type Store interface {
	Save(url URL) error
	Get(id string) (URL, bool)
	GetByURL(originalURL string) (URL, bool)
	GetByURLAndUser(originalURL string, userID string) (URL, bool)
	GetByUserID(userID string) ([]URL, error)
	Delete(id string) error
}
