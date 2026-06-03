package url

import (
	"fmt"
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
	b := make([]byte, 8)

	for i := range b {
		b[i] = chars[(rand.Intn(len(chars)))]
	}

	return string(b)
}

func (s *Service) Shorten(userID string, original string) (string, error) {

	existing, ok := s.store.GetByURLAndUser(original, userID)
	if ok {
		return existing.ID, nil
	}

	id := generateID()

	url := URL{
		ID:     id,
		URL:    original,
		UserID: userID,
	}

	err := s.store.Save(url)

	if err != nil {
		return "", err
	}

	return id, nil
}

func (s *Service) GetUserURLs(userID string) ([]URL, error) {
	return s.store.GetByUserID(userID)
}

func (s *Service) DeleteURL(userID string, id string) error {
	url, ok := s.store.Get(id)
	if !ok {
		return fmt.Errorf("not_found")
	}

	if url.UserID != userID {
		return fmt.Errorf("unauthorized")
	}

	return s.store.Delete(id)
}

func (s *Service) Resolve(id string) (string, bool) {
	url, ok := s.store.Get(id)

	if !ok {
		return "", false
	}
	return url.URL, true
}

func (s *Service) IncrementClicks(id string) error {
	return s.store.IncrementClicks(id)
}