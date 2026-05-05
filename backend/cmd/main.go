package main

import (
	"fmt"
	"net/http"
	"urlshortener/backend/internal/url"
)

func main() {

	store := url.NewMemoryStore()
	service := url.NewService(store)
	handler := url.NewHandler(service)

	http.HandleFunc("/shorten", handler.Shorten)
	http.HandleFunc("/r/", handler.Redirect)

	fmt.Println("Server running on :8080")
	http.ListenAndServe(":8080", nil)
}
