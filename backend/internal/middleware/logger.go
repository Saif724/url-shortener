package middleware

import (
	"encoding/json"
	"log"
	"net/http"
	"time"
)

type LogEntry struct {
	Level     string `json:"level"`
	Timestamp string `json:"timestamp"`
	RequestID string `json:"request_id"`
	Method    string `json:"method"`
	Path      string `json:"path"`
	Duration  string `json:"duration"`
}

func Logger(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()

		requestIDVal := r.Context().Value(RequestIDKey)
		requestID := ""
		if requestIDVal != nil {
			requestID = requestIDVal.(string)
		}

		next.ServeHTTP(w, r)

		entry := LogEntry{
			Level:     "INFO",
			Timestamp: time.Now().Format(time.RFC3339),
			RequestID: requestID,
			Method:    r.Method,
			Path:      r.URL.Path,
			Duration:  time.Since(start).String(),
		}

		data, _ := json.Marshal(entry)
		log.Println(string(data))
	})
}
