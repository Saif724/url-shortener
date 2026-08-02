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
	"urlshortener/backend/internal/migrate"
	"urlshortener/backend/internal/url"
	"urlshortener/backend/internal/user"

	"github.com/joho/godotenv"
)

func serveSwaggerUI() string {
	return `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">

	<title>Shorty API Documentation</title>

	<link rel="icon" type="image/png" href="/logo.png">

	<link
		rel="stylesheet"
		href="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css"
	/>

	<style>
		html {
			box-sizing: border-box;
			overflow-y: scroll;
			background: #f8fafc;
		}

		*,
		*:before,
		*:after {
			box-sizing: inherit;
		}

		body {
			margin: 0;
			padding: 0;
			background: #f8fafc;
			font-family: Inter, Arial, sans-serif;
		}

		.topbar {
			background: #2563eb !important;
			padding: 12px 0;
		}

		.swagger-ui .topbar-wrapper img {
			display: none;
		}

		.swagger-ui .topbar-wrapper::before {
			content: "🚀 Shorty API";
			color: white;
			font-size: 22px;
			font-weight: 700;
		}

		.swagger-ui .info {
			margin: 30px 0;
		}

		.swagger-ui .info hgroup.main h2 {
			font-size: 34px;
		}

		.swagger-ui .scheme-container {
			border-radius: 12px;
			box-shadow: 0 8px 30px rgba(0,0,0,.08);
		}

		.swagger-ui .opblock {
			border-radius: 10px;
			overflow: hidden;
		}

		.swagger-ui .btn.authorize {
			border-radius: 8px;
		}

		.swagger-ui .download-url-wrapper {
			display: none;
		}
	</style>
</head>

<body>

<div id="swagger-ui"></div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js"></script>

<script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js"></script>

<script>
window.onload = function () {

	const ui = SwaggerUIBundle({

		url: window.location.origin + "/openapi.yaml",

		dom_id: "#swagger-ui",

		deepLinking: true,

		docExpansion: "list",

		defaultModelsExpandDepth: 1,

		defaultModelExpandDepth: 2,

		displayRequestDuration: true,

		filter: true,

		tryItOutEnabled: true,

		persistAuthorization: true,

		showExtensions: true,

		showCommonExtensions: true,

		presets: [
			SwaggerUIBundle.presets.apis,
			SwaggerUIStandalonePreset
		],

		plugins: [
			SwaggerUIBundle.plugins.DownloadUrl
		],

		layout: "StandaloneLayout"
	});

	window.ui = ui;
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
	if err :=migrate.Run(store.DB()); err!= nil {
		panic(err)
	}

	userStore := user.NewPostgresUserStore(store.DB())
	userService := user.NewUserService(userStore, jwtService)

	urlHandler := url.NewHandler(urlService, redisCache, &cfg)
	userHandler := user.NewUserHandler(userService)

	authMiddleware := middleware.Auth(cfg.JWTSecret)

	rateLimiter := middleware.RateLimiter(10, 1)

	corsMiddleware := middleware.CORS([]string{
		"https://shorty-lyart.vercel.app",
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
