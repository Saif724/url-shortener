package middleware

import (
	"log"
	"net/http"
	"time"
)

func Logger(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()

		requestID := r.Context().Value(RequestIDKey)

		next.ServeHTTP(w, r)

		log.Printf(
			"[%s] METHOD: %s | PATH: %s | DURATION: %s",
			requestID,
			r.Method,
			r.URL.Path,
			time.Since(start),
		)
	})
}
