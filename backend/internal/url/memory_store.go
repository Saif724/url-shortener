package url

import (
	"fmt"
	"sync"
)

type MemoryStore struct {
	urls map[string]URL
	mu   sync.Mutex
}

func NewMemoryStore() *MemoryStore {
	return &MemoryStore{
		urls: make(map[string]URL),
	}
}

func (m *MemoryStore) Save(url URL) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	if _, exists := m.urls[url.ID]; exists {
		return fmt.Errorf("URL already exists")
	}

	m.urls[url.ID] = url
	return nil
}

func (m *MemoryStore) Get(id string) (URL, bool) {
	m.mu.Lock()
	defer m.mu.Unlock()

	url, exists := m.urls[id]
	return url, exists
}

func (m *MemoryStore) GetByURL(originalURL string) (URL, bool) {
	m.mu.Lock()
	defer m.mu.Unlock()

	for _, url := range m.urls {
		if url.URL == originalURL {
			return url, true
		}
	}
	return URL{}, false
}

func (m *MemoryStore) GetByURLAndUser(originalURL string, userID string) (URL, bool) {
	m.mu.Lock()
	defer m.mu.Unlock()

	for _, url := range m.urls {
		if url.URL == originalURL && url.UserID == userID {
			return url, true
		}
	}
	return URL{}, false
}

func (m *MemoryStore) GetByUserID(userID string) ([]URL, error) {
	m.mu.Lock()
	defer m.mu.Unlock()

	var urls []URL
	for _, url := range m.urls {
		if url.UserID == userID {
			urls = append(urls, url)
		}
	}
	return urls, nil
}

func (m *MemoryStore) Delete(id string) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	if _, exists := m.urls[id]; !exists {
		return fmt.Errorf("URL not found")
	}

	delete(m.urls, id)
	return nil
}

func (m *MemoryStore) IncrementClicks(id string) error {
	return nil
}