package url

type Store interface {
	Save(url URL) error
	Get(id string) (URL, bool)
	GetByURL(originalURL string) (URL, bool)
}
