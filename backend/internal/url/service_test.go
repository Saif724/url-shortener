package url

import (
	"testing"
)

func TestShortenGenerateID(t *testing.T) {
	store := NewMemoryStore()
	service := NewService(store)

	id, err := service.Shorten("http://google.com")

	if err != nil {
		t.Fatalf("expected no error, got %v", err)

	}

	if id == "" {
		t.Fatalf("expected non-empty id, got empty string")

	}
}

func TestShortenSavesToStore(t *testing.T) {
	store := NewMemoryStore()
	service := NewService(store)

	originalURL := "https://google.com"
	id, err := service.Shorten(originalURL)

	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}

	// Now verify it was actually saved
	resolved, ok := service.Resolve(id)

	if !ok {
		t.Fatalf("expected to find URL with id %s", id)
	}

	if resolved != originalURL {
		t.Fatalf("expected %s, got %s", originalURL, resolved)
	}
}
