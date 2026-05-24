package url

import (
	"testing"
)

func TestShortenNew(t *testing.T) {
	store := NewMemoryStore()
	service := NewService(store)

	id, err := service.Shorten("user1", "https://google.com")
	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if id == "" {
		t.Fatal("Expected URL ID, got empty")
	}
}

func TestShortenDuplicate(t *testing.T) {
	store := NewMemoryStore()
	service := NewService(store)

	id1, _ := service.Shorten("user1", "https://google.com")
	id2, _ := service.Shorten("user1", "https://google.com")

	if id1 != id2 {
		t.Fatalf("Expected same ID for duplicate URL, got %s vs %s", id1, id2)
	}
}

func TestShortenDifferentUsers(t *testing.T) {
	store := NewMemoryStore()
	service := NewService(store)

	id1, _ := service.Shorten("user1", "https://google.com")

	id2, _ := service.Shorten("user2", "https://google.com")

	if id1 == id2 {
		t.Fatal("Expected different IDs for different users")
	}
}

func TestResolve(t *testing.T) {
	store := NewMemoryStore()
	service := NewService(store)

	id, _ := service.Shorten("user1", "https://google.com")

	url, ok := service.Resolve(id)
	if !ok {
		t.Fatal("Expected URL to be found")
	}

	if url != "https://google.com" {
		t.Fatalf("Expected https://google.com, got %s", url)
	}
}

func TestResolveNotFound(t *testing.T) {
	store := NewMemoryStore()
	service := NewService(store)

	_, ok := service.Resolve("nonexistent")
	if ok {
		t.Fatal("Expected URL not to be found")
	}
}

func TestDeleteURL(t *testing.T) {
	store := NewMemoryStore()
	service := NewService(store)

	id, _ := service.Shorten("user1", "https://google.com")

	err := service.DeleteURL("user1", id)
	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	_, ok := service.Resolve(id)
	if ok {
		t.Fatal("Expected URL to be deleted")
	}
}

func TestDeleteUnauthorized(t *testing.T) {
	store := NewMemoryStore()
	service := NewService(store)

	id, _ := service.Shorten("user1", "https://google.com")

	err := service.DeleteURL("user2", id)
	if err.Error() != "unauthorized" {
		t.Fatalf("Expected unauthorized error, got %v", err)
	}
}

func TestGetUserURLs(t *testing.T) {
	store := NewMemoryStore()
	service := NewService(store)

	service.Shorten("user1", "https://google.com")
	service.Shorten("user1", "https://github.com")
	service.Shorten("user2", "https://amazon.com")

	urls, _ := service.GetUserURLs("user1")
	if len(urls) != 2 {
		t.Fatalf("Expected 2 URLs for user1, got %d", len(urls))
	}
}
