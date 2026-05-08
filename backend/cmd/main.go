package main

import (
	"fmt"
	"net/http"
	"os"
	"urlshortener/backend/internal/middleware"
	"urlshortener/backend/internal/url"
)

func main() {

	connStr := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s", os.Getenv("DB_HOST"), os.Getenv("DB_PORT"), os.Getenv("DB_USER"), os.Getenv("DB_PASSWORD"), os.Getenv("DB_NAME"), os.Getenv("DB_SSLMODE"))

	store, err := url.NewPostgresStore(connStr)
	if err != nil {
		panic(err)
	}

	service := url.NewService(store)
	handler := url.NewHandler(service)

	mux := http.NewServeMux()

	mux.HandleFunc("/shorten", handler.Shorten)
	mux.HandleFunc("/r/", handler.Redirect)

	fmt.Println("Server running on :8080")
	handleWithLogging := middleware.Logger(mux)
	http.ListenAndServe(":8080", handleWithLogging)
}
