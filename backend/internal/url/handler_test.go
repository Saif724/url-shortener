package url

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestShortenHandler(t *testing.T) {
	store := NewMemoryStore()
	service := NewService(store)
	handler := NewHandler(service)

	body := map[string]string{"url": "https://google.com"}
	bodyBytes, _ := json.Marshal(body)

	req := httptest.NewRequest("POST", "/shorten", bytes.NewReader(bodyBytes))
	w := httptest.NewRecorder()

	handler.Shorten(w, req)

	if w.Code != http.StatusCreated {
		t.Fatalf("expected status id %d, got %d", http.StatusCreated, w.Code)

	}

	var response map[string]interface{}
	json.NewDecoder(w.Body).Decode(&response)

	if response["success"] != true {
		t.Fatalf("expected success+true")
	}

	if response["data"] == nil {
		t.Fatalf("expected data field")
	}
}

func TestShortenHandlerEmptyURl(t *testing.T) {
	store := NewMemoryStore()
	service := NewService(store)
	handler := NewHandler(service)

	body := map[string]string{"url": ""}
	bodyBytes, _ := json.Marshal(body)

	req := httptest.NewRequest("POST", "/shorten", bytes.NewReader(bodyBytes))
	w := httptest.NewRecorder()

	handler.Shorten(w, req)

	if w.Code != http.StatusBadRequest {
		t.Fatalf("expected status %d, got %d", http.StatusBadRequest, w.Code)

	}

}

func TestShortenHandlerInvalidURL(t *testing.T) {
	store := NewMemoryStore()
	service := NewService(store)
	handler := NewHandler(service)

	body := map[string]string{"url": "jesata.com"}
	bodyBytes, _ := json.Marshal(body)

	req := httptest.NewRequest("POST", "/shorten", bytes.NewReader(bodyBytes))
	w := httptest.NewRecorder()

	handler.Shorten(w, req)

	if w.Code != http.StatusBadRequest {
		t.Fatalf("expected error %d, got %d", http.StatusBadRequest, w.Code)

	}
}
