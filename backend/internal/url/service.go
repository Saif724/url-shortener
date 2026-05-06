package url

import (
	"math/rand"
	"time"
)

type Service struct {
	store Store
}

func NewService(store Store) *Service {
	rand.Seed(time.Now().UnixNano())
	return &Service{store: store}
}

func generateID() string {
	const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	b := make([]byte, 6)

	for i := range b {
		b[i] = chars[(rand.Intn(len(chars)))]
	}

	return string(b)
}

func (s *Service) Shorten(original string) (string, error) {
	id := generateID()

	url := URL{
		ID:  id,
		URL: original,
	}

	err := s.store.Save(url)

	if err != nil {
		return "", err
	}

	return id, nil
}

func (s *Service) Resolve(id string) (string, bool) {
	url, ok := s.store.Get(id)

	if !ok {
		return "", false
	}
	return url.URL, true
}
