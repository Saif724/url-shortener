package main

import (
	"fmt"
	"net/http"
	"os"
	"urlshortener/backend/internal/url"
)

func main() {

	os.Setenv("host", "127.0.0.1")
	os.Setenv("port", "5432")
	os.Setenv("user", "postgres")
	os.Setenv("password", "2023")
	os.Setenv("dbname", "url_shortener")
	os.Setenv("sslmode", "disable")
	connStr := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s", os.Getenv("host"), os.Getenv("port"), os.Getenv("user"), os.Getenv("password"), os.Getenv("dbname"), os.Getenv("sslmode"))

	store, err := url.NewPostgresStore(connStr)
	if err != nil {
		panic(err)
	}

	service := url.NewService(store)
	handler := url.NewHandler(service)

	http.HandleFunc("/shorten", handler.Shorten)
	http.HandleFunc("/r/", handler.Redirect)

	fmt.Println("Server running on :8080")
	http.ListenAndServe(":8080", nil)
}
