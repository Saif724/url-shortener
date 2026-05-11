package middleware

import (
	"fmt"
	"log"
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

func RateLimiter1(capacity float64, refillRate float64) func(http.Handler) http.Handler {
	buckets := make(map[string]*TokenBucket)
	var mu sync.Mutex

	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			clientIP := getClientIP(r)
			log.Printf(">>> RATE LIMITER: Checking IP [%s]\n", clientIP)

			mu.Lock()
			bucket, exists := buckets[clientIP]

			if !exists {
				bucket = NewTokenBucket(capacity, refillRate)
				buckets[clientIP] = bucket
			}
			mu.Unlock()

			if !bucket.AllowRequest(10.0) {
				http.Error(w, "Too Many Request", http.StatusTooManyRequests)
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}

func RateLimiter(capacity float64, refillRate float64) func(http.Handler) http.Handler {
	fmt.Println(">>> INITIALIZING RATE LIMITER MAP") // Runs once at startup
	buckets := make(map[string]*TokenBucket)
	var mu sync.Mutex

	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// This MUST print if the middleware is reached
			log.Printf("!!! [RATE LIMITER] STEP 1: Request received for %s", r.URL.Path)

			clientIP := getClientIP(r)
			log.Printf("!!! [RATE LIMITER] STEP 2: IP is %s", clientIP)

			mu.Lock()
			bucket, exists := buckets[clientIP]
			if !exists {
				log.Printf("!!! [RATE LIMITER] STEP 3: Creating new bucket for %s", clientIP)
				bucket = NewTokenBucket(capacity, refillRate)
				buckets[clientIP] = bucket
			}
			mu.Unlock()

			if !bucket.AllowRequest(1.0) {
				log.Printf("!!! [RATE LIMITER] STEP 4: REJECTING %s", clientIP)
				http.Error(w, "Too Many Requests", http.StatusTooManyRequests)
				return
			}

			log.Printf("!!! [RATE LIMITER] STEP 5: ALLOWING %s. Tokens left: %.2f", clientIP, bucket.tokens)
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
