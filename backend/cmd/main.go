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

func serveSwaggerUI() string {
	return `<!DOCTYPE html>
<html>
<head>
	<title>URL Shortener API Documentation</title>
	<meta charset="utf-8"/>
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css">
	<style>
		html {
			box-sizing: border-box;
			overflow: -moz-scrollbars-vertical;
			overflow-y: scroll;
		}
		*, *:before, *:after {
			box-sizing: inherit;
		}
		body {
			margin: 0;
			padding: 0;
			background: #fafafa;
		}
	</style>
</head>
<body>
	<div id="swagger-ui"></div>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js"></script>
	<script>
		window.onload = function() {
			const ui = SwaggerUIBundle({
				url: "http://localhost:8080/openapi.yaml",
				dom_id: '#swagger-ui',
				deepLinking: true,
				presets: [
					SwaggerUIBundle.presets.apis,
					SwaggerUIStandalonePreset
				],
				plugins: [
					SwaggerUIBundle.plugins.DownloadUrl
				],
				layout: "StandaloneLayout"
			})
			window.ui = ui
		}
	</script>
</body>
</html>`
}

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

	mux.HandleFunc("/docs", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/html; charset=utf-8")
		w.Write([]byte(serveSwaggerUI()))
	})

	mux.HandleFunc("/openapi.yaml", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/yaml")
		http.ServeFile(w, r, "openapi.yaml")
	})

	fmt.Println("Server running on :8080")

	handleWithRateLimit := rateLimiter(mux)
	handleWithLogging := middleware.Logger(handleWithRateLimit)
	handleWithRequestID := middleware.RequestID(handleWithLogging)
	handleWithCors := corsMiddleware(handleWithRequestID)
	http.ListenAndServe(":8080", handleWithCors)
}
