package user

import (
	"encoding/json"
	"net/http"
	"urlshortener/backend/internal/api"
)

type UserHandler struct {
	service *UserService
}

func NewUserHandler(service *UserService) *UserHandler {
	return &UserHandler{
		service: service,
	}
}

func (uh *UserHandler) Register(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		api.RespondError(w, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "Only POST allowed")
		return
	}

	var registerReq LoginRequest
	err := json.NewDecoder(r.Body).Decode(&registerReq)
	if err != nil {
		api.RespondError(w, http.StatusBadRequest, "INVALID_JSON", "Invalid JSON")
		return
	}

	userID, err := uh.service.Register(registerReq.Email, registerReq.Password)
	if err != nil {
		api.RespondError(w, http.StatusBadRequest, "REGISTRATION_ERROR", err.Error())
		return
	}

	api.RespondSuccess(w, http.StatusCreated, map[string]string{
		"user_id": userID,
		"message": "User registered succussfully",
	})
}

func (uh *UserHandler) Login(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		api.RespondError(w, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "Only POST allowed")
		return
	}

	var loginReq LoginRequest
	err := json.NewDecoder(r.Body).Decode(&loginReq)
	if err != nil {
		api.RespondError(w, http.StatusBadRequest, "INVALID_JSON", "Invalid JSON")
		return
	}

	token, err := uh.service.Login(loginReq.Email, loginReq.Password)
	if err != nil {
		api.RespondError(w, http.StatusUnauthorized, "LOGIN_FAILED", "Invalid email or password")
		return
	}

	api.RespondSuccess(w, http.StatusOK, LoginResponse{
		Success: true,
		Token:   token,
		UserID:  "user",
	})
}
