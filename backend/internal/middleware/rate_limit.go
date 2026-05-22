package middleware

import (
	"net"
	"net/http"
	"sync"
	"time"
)

type TokenBucket struct {
	capacity       float64
	refillRate     float64
	tokens         float64
	lastRefillTime time.Time
	mu             sync.Mutex
}

func NewTokenBucket(capacity float64, refillRate float64) *TokenBucket {
	return &TokenBucket{
		capacity:       capacity,
		refillRate:     refillRate,
		tokens:         capacity,
		lastRefillTime: time.Now(),
	}
}

func (tb *TokenBucket) AllowRequest(tokens float64) bool {
	tb.mu.Lock()
	defer tb.mu.Unlock()
	now := time.Now()
	timePeriod := now.Sub(tb.lastRefillTime).Seconds()
	tb.tokens = tb.tokens + (timePeriod * tb.refillRate)

	if tb.tokens > tb.capacity {
		tb.tokens = tb.capacity
	}

	tb.lastRefillTime = now

	if tb.tokens >= tokens {
		tb.tokens -= tokens
		return true
	}

	return false
}

func RateLimiter(capacity float64, refillRate float64) func(http.Handler) http.Handler {
	buckets := make(map[string]*TokenBucket)
	var mu sync.Mutex

	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			clientIP := getClientIP(r)

			mu.Lock()
			bucket, exists := buckets[clientIP]

			if !exists {
				bucket = NewTokenBucket(capacity, refillRate)
				buckets[clientIP] = bucket
			}
			mu.Unlock()

			if !bucket.AllowRequest(1.0) {
				http.Error(w, "Too Many Request", http.StatusTooManyRequests)
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}

func getClientIP(r *http.Request) string {
	if xff := r.Header.Get("X-Forwarded-For"); xff != "" {
		ip, _, _ := net.SplitHostPort(xff)
		if ip != "" {
			return ip
		}
	}

	if xri := r.Header.Get("X-Real-IP"); xri != "" {
		return xri
	}

	ip, _, _ := net.SplitHostPort(r.RemoteAddr)
	return ip
}
