package main

import (
	"encoding/json"
	"fmt"
	"math/rand"
	"net/http"
	"sync"
)

var (
	store = make(map[string]string)
	mu    sync.Mutex
)

func generateID() string {
	const chars = "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTWXYZ"
	b := make([]byte, 6)
	for i := range b {
		b[i] = chars[rand.Intn(len(chars))]
	}
	return string(b)
}

func shorten(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Only POST allowed", http.StatusMethodNotAllowed)
		return
	}

	var body struct {
		URL string `json:"url"`
	}

	json.NewDecoder(r.Body).Decode(&body)

	if body.URL == "" {
		http.Error(w, "URL required", http.StatusBadRequest)
		return
	}

	id := generateID()

	mu.Lock()
	store[id] = body.URL
	mu.Unlock()

	fmt.Println("shorten called for", body.URL)
	fmt.Println("Generated id:", id)

	json.NewEncoder(w).Encode(map[string]string{
		"id": id,
	})
}

func redirect(w http.ResponseWriter, r *http.Request) {
	id := r.URL.Path[len("/r/"):]

	mu.Lock()
	url, ok := store[id]
	mu.Unlock()
	if !ok {
		http.NotFound(w, r)
		return
	}

	http.Redirect(w, r, url, http.StatusFound)
}

func main() {
	http.HandleFunc("/shorten", shorten)
	http.HandleFunc("/r/", redirect)

	fmt.Println("Server running on :8080")
	http.ListenAndServe(":8080", nil)
}
