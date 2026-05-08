package middleware

import (
	"fmt"
	"log"
	"net/http"
	"time"
)

func Logger(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		fmt.Println("--- DEBUG: Request Received ---")
		start := time.Now()

		next.ServeHTTP(w, r)

		log.Printf(
			"METHOD: %s | PATH: %s | DURATION: %s",
			r.Method,
			r.URL.Path,
			time.Since(start),
		)
	})
}
