package user

import (
	"encoding/json"
	"net/http"
)

type UserHandler struct {
	jwt JWTService
}

func NewUserHandler(jwt JWTService) *UserHandler {
	return &UserHandler{
		jwt: jwt,
	}
}

func (uh *UserHandler) Login(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Only POST allowed", http.StatusMethodNotAllowed)
		return
	}

	var loginReq LoginRequest
	err := json.NewDecoder(r.Body).Decode(&loginReq)
	if err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	if loginReq.Email != "test@example.com" || loginReq.Password != "password123" {
		http.Error(w, "Invalid email or password", http.StatusUnauthorized)
		return
	}

	token, err := uh.jwt.GenerateToken("user123", loginReq.Email)
	if err != nil {
		http.Error(w, "Failed to generate token", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(LoginResponse{
		Success: true,
		Token:   token,
		UserID:  "user123",
	})
}
