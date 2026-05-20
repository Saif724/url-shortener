package middleware

import (
	"context"
	"fmt"
	"net/http"
	"strings"
	"urlshortener/backend/internal/api"

	"github.com/golang-jwt/jwt/v5"
)

func Auth(secretKey string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			authHeader := r.Header.Get("Authorization")
			if authHeader == "" {
				api.RespondError(w, http.StatusUnauthorized, "MISSING_AUTH_HEADER", "Missing authorization header")
				return
			}

			parts := strings.Split(authHeader, " ")
			if len(parts) != 2 || parts[0] != "Bearer" {
				api.RespondError(w, http.StatusUnauthorized, "INVALID_AUTH_FORMAT", "Invalid authorization format")
				return
			}

			tokenString := parts[1]

			token, err := jwt.ParseWithClaims(tokenString, jwt.MapClaims{}, func(token *jwt.Token) (interface{}, error) {
				if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
					return nil, fmt.Errorf("unexpected signing method")
				}
				return []byte(secretKey), nil
			})

			if err != nil || !token.Valid {
				api.RespondError(w, http.StatusUnauthorized, "INVALID_TOKEN", "Invalid token")
				return
			}

			claims, ok := token.Claims.(jwt.MapClaims)
			if !ok {
				api.RespondError(w, http.StatusUnauthorized, "INVALID_CLAIMS", "Invalid token claims")
				return
			}
			userID, exists := claims["user_id"]
			if !exists {
				api.RespondError(w, http.StatusUnauthorized, "USER_ID_MISSING", "user_id not in token")
				return
			}

			userIDStr, ok := userID.(string)

			if !ok {
				api.RespondError(w, http.StatusUnauthorized, "INVALID_USER_ID_TYPE", "user_id is not a string")
				return
			}

			ctx := context.WithValue(r.Context(), "user_id", userIDStr)
			r = r.WithContext(ctx)

			next.ServeHTTP(w, r)
		})
	}
}
