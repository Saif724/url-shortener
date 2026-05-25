package main

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"urlshortener/backend/internal/cache"
	"urlshortener/backend/internal/config"
	"urlshortener/backend/internal/middleware"
	"urlshortener/backend/internal/url"
	"urlshortener/backend/internal/user"

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
				url: window.location.origin + "/openapi.yaml",
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

	_ = godotenv.Load()
	cfg := config.Load()

	store, err := url.NewPostgresStore(cfg.DBURL)
	if err != nil {
		panic(fmt.Sprintf("Failed to connect to database: %v", err))
	}

	redisCache := cache.NewRedisCache(cfg.RedisURL)
	defer redisCache.Close()

	jwtService := user.NewJWTService(cfg.JWTSecret)

	urlService := url.NewService(store)

	userStore := user.NewPostgresUserStore(store.DB())
	userService := user.NewUserService(userStore, jwtService)

	urlHandler := url.NewHandler(urlService, redisCache, &cfg)
	userHandler := user.NewUserHandler(userService)

	authMiddleware := middleware.Auth(cfg.JWTSecret)

	rateLimiter := middleware.RateLimiter(10, 1)

	corsMiddleware := middleware.CORS([]string{
		"*",
	})

	mux := http.NewServeMux()

	mux.HandleFunc("/login", userHandler.Login)
	mux.HandleFunc("/register", userHandler.Register)
	mux.HandleFunc("/r/", urlHandler.Redirect)

	shortenHandler := authMiddleware(http.HandlerFunc(urlHandler.Shorten))
	mux.Handle("/shorten", shortenHandler)

	getUserURLsHandler := authMiddleware(http.HandlerFunc(urlHandler.GetUserURLs))
	mux.Handle("/user/urls", getUserURLsHandler)

	deleteURLHandler := authMiddleware(http.HandlerFunc(urlHandler.DeleteURL))
	mux.Handle("/user/urls/", deleteURLHandler)

	mux.HandleFunc("/docs", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/html; charset=utf-8")
		w.Write([]byte(serveSwaggerUI()))
	})

	mux.HandleFunc("/openapi.yaml", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/yaml")
		http.ServeFile(w, r, "openapi.yaml")
	})

	var handler http.Handler = mux

	handler = corsMiddleware(handler)
	handler = rateLimiter(handler)
	handler = middleware.Logger(handler)
	handler = middleware.RequestID(handler)

	server := &http.Server{
		Addr:         ":" + cfg.Port,
		Handler:      handler,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	go func() {
		fmt.Println("Server running on :" + cfg.Port)
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			panic(err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	fmt.Println("Shutting down server...")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := server.Shutdown(ctx); err != nil {
		fmt.Println("Server shutdown error:", err)
	}
}
