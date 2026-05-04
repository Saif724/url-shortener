package url

type Store interface {
	Save(url URL)
	Get(id string) (URL, bool)
}

type MemoryStore struct {
	data map[string]URL
}

func NewMemoryStore() *MemoryStore {
	return &MemoryStore{
		data: make(map[string]URL),
	}
}

func (m *MemoryStore) Save(url URL) {
	m.data[url.ID] = url
}

func (m *MemoryStore) Get(id string) (URL, bool) {
	url, ok := m.data[id]
	return url, ok
}
