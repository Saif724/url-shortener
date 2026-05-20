package url

import (
	"sync"
)

type MemoryStore struct {
	data map[string]URL
	mu   sync.Mutex
}

func NewMemoryStore() *MemoryStore {
	return &MemoryStore{
		data: make(map[string]URL),
	}
}

func (m *MemoryStore) Save(url URL) error {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.data[url.ID] = url
	return nil
}

func (m *MemoryStore) Get(id string) (URL, bool) {
	m.mu.Lock()
	defer m.mu.Unlock()
	url, ok := m.data[id]
	return url, ok
}

func (m *MemoryStore) GetByURL(original string) (URL, bool) {
	m.mu.Lock()
	defer m.mu.Unlock()
	for _, url := range m.data {
		if url.URL == original {
			return url, true
		}
	}
	return URL{}, false
}

func (m *MemoryStore) GetByURLAndUser(originalURL string, userID string) (URL, bool) {
	return URL{}, false
}
func (m *MemoryStore) GetByUserID(userID string) ([]URL, error) {
	return []URL{}, nil
}
func (m *MemoryStore) Delete(id string) error {
	return nil
}
