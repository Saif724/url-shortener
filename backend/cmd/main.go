package main

import (
	"fmt"
	"net/http"
	"os"
	"urlshortener/backend/internal/cache"
	"urlshortener/backend/internal/middleware"
	"urlshortener/backend/internal/url"

	"github.com/joho/godotenv"
)

func main() {

	godotenv.Load()

	connStr := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s", os.Getenv("DB_HOST"), os.Getenv("DB_PORT"), os.Getenv("DB_USER"), os.Getenv("DB_PASSWORD"), os.Getenv("DB_NAME"), os.Getenv("DB_SSLMODE"))

	store, err := url.NewPostgresStore(connStr)
	if err != nil {
		panic(err)
	}

	redisCache := cache.NewRedisCache(
		os.Getenv("REDIS_HOST"),
		os.Getenv("REDIS_PORT"),
	)
	defer redisCache.Close()

	service := url.NewService(store)
	handler := url.NewHandler(service, redisCache)

	rateLimiter := middleware.RateLimiter(10, 1)
	corsMiddleware := middleware.CORS([]string{"http://localhost:3000", "*"})

	mux := http.NewServeMux()

	mux.HandleFunc("/shorten", handler.Shorten)
	mux.HandleFunc("/r/", handler.Redirect)

	fmt.Println("Server running on :8080")

	handleWithRateLimit := rateLimiter(mux)
	handleWithLogging := middleware.Logger(handleWithRateLimit)
	handleWithRequestID := middleware.RequestID(handleWithLogging)
	handleWithCors := corsMiddleware(handleWithRequestID)
	http.ListenAndServe(":8080", handleWithCors)
}
