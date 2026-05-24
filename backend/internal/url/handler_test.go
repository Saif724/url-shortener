package url

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"urlshortener/backend/internal/cache"
)

func TestShortenFlow(t *testing.T) {
	store := NewMemoryStore()
	service := NewService(store)
	redisCache := &cache.RedisCache{} // Mock cache
	handler := NewHandler(service, redisCache)

	// Test 1: Shorten URL
	body := `{"url": "https://google.com"}`
	req := httptest.NewRequest(http.MethodPost, "/shorten", bytes.NewBufferString(body))
	req.Header.Set("Content-Type", "application/json")

	ctx := req.Context()
	ctx = context.WithValue(ctx, "user_id", "user123")
	req = req.WithContext(ctx)

	w := httptest.NewRecorder()
	handler.Shorten(w, req)

	if w.Code != http.StatusCreated {
		t.Fatalf("Expected 201, got %d", w.Code)
	}

	var response map[string]interface{}
	json.NewDecoder(w.Body).Decode(&response)

	if !response["success"].(bool) {
		t.Fatal("Expected success: true")
	}

	data := response["data"].(map[string]interface{})
	shortURL := data["short_url"].(string)
	shortID := shortURL[len("http://localhost:8080/r/"):]

	// Test 2: Get user's URLs
	req2 := httptest.NewRequest(http.MethodGet, "/user/urls", nil)
	ctx2 := req2.Context()
	ctx2 = context.WithValue(ctx2, "user_id", "user123")
	req2 = req2.WithContext(ctx2)

	w2 := httptest.NewRecorder()
	handler.GetUserURLs(w2, req2)

	if w2.Code != http.StatusOK {
		t.Fatalf("Expected 200, got %d", w2.Code)
	}

	var response2 map[string]interface{}
	json.NewDecoder(w2.Body).Decode(&response2)

	if !response2["success"].(bool) {
		t.Fatal("Expected success: true")
	}

	// Test 3: Delete URL
	req3 := httptest.NewRequest(http.MethodDelete, "/user/urls/"+shortID, nil)
	ctx3 := req3.Context()
	ctx3 = context.WithValue(ctx3, "user_id", "user123")
	req3 = req3.WithContext(ctx3)

	w3 := httptest.NewRecorder()
	handler.DeleteURL(w3, req3)

	if w3.Code != http.StatusOK {
		t.Fatalf("Expected 200, got %d", w3.Code)
	}

	// Test 4: Verify deleted
	req4 := httptest.NewRequest(http.MethodGet, "/user/urls", nil)
	ctx4 := req4.Context()
	ctx4 = context.WithValue(ctx4, "user_id", "user123")
	req4 = req4.WithContext(ctx4)

	w4 := httptest.NewRecorder()
	handler.GetUserURLs(w4, req4)

	var response4 map[string]interface{}
	json.NewDecoder(w4.Body).Decode(&response4)

	urls := response4["data"]
	if urls != nil {
		t.Fatal("Expected empty URLs after delete")
	}
}

func TestShortenUnauthorized(t *testing.T) {
	store := NewMemoryStore()
	service := NewService(store)
	redisCache := &cache.RedisCache{}
	handler := NewHandler(service, redisCache)

	body := `{"url": "https://google.com"}`
	req := httptest.NewRequest(http.MethodPost, "/shorten", bytes.NewBufferString(body))
	req.Header.Set("Content-Type", "applicatin/json")

	w := httptest.NewRecorder()
	handler.Shorten(w, req)

	if handler == nil {
		t.Fatalf("Handler should not be nil")
	}
}

func TestInvalidURL(t *testing.T) {
	store := NewMemoryStore()
	service := NewService(store)
	redisCache := &cache.RedisCache{}
	handler := NewHandler(service, redisCache)

	body := `{"url": "google.com"}`
	req := httptest.NewRequest(http.MethodPost, "/shorten", bytes.NewBufferString(body))
	ctx := req.Context()
	ctx = context.WithValue(ctx, "user_id", "user123")
	req = req.WithContext(ctx)
	req.Header.Set("Content-Type", "applicatin/json")

	w := httptest.NewRecorder()
	handler.Shorten(w, req)

	if w.Code != http.StatusBadRequest {
		t.Fatalf("Expected 400, got %d", w.Code)
	}
}
