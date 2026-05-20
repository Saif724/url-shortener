package url

import (
	"encoding/json"
	"net/http"
	"net/url"
	"time"
	"urlshortener/backend/internal/api"
	"urlshortener/backend/internal/cache"
)

type Handler struct {
	service *Service
	cache   *cache.RedisCache
}

func NewHandler(service *Service, cache *cache.RedisCache) *Handler {
	return &Handler{
		service: service,
		cache:   cache,
	}
}

func (h *Handler) Shorten(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		api.RespondError(w, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "Only POST allowed")
		return
	}

	userID, ok := r.Context().Value("user_id").(string)
	if !ok {
		api.RespondError(w, http.StatusInternalServerError, "CONTEXT_ERROR", "Invalid user_id in context")
		return
	}

	var body struct {
		URL string `json:"url"`
	}

	err := json.NewDecoder(r.Body).Decode(&body)

	if err != nil {
		api.RespondError(w, http.StatusBadRequest, "INVALID_JSON", "Invalid JSON")
		return
	}

	if body.URL == "" {
		api.RespondError(w, http.StatusBadRequest, "URL_REQUIRED", "URL required")
		return
	}

	_, err = url.ParseRequestURI(body.URL)

	if err != nil {
		api.RespondError(w, http.StatusBadRequest, "INVALID_URL", "Invalid URL")
		return
	}
	id, err := h.service.Shorten(userID, body.URL)

	if err != nil {
		api.RespondError(w, http.StatusInternalServerError, "SERVICE_ERROR", "Something went wrong")
		return
	}

	api.RespondSuccess(w, http.StatusCreated, map[string]string{
		"short_url": "http://localhost:8080/r/" + id,
	})
}

func (h *Handler) Redirect(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		api.RespondError(w, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "Only GET allowed")
		return
	}

	id := r.URL.Path[len("/r/"):]

	cachedURL, err := h.cache.Get(r.Context(), id)
	if err == nil && cachedURL != "" {
		http.Redirect(w, r, cachedURL, http.StatusFound)
		return
	}

	url, ok := h.service.Resolve(id)

	if !ok {
		api.RespondError(w, http.StatusNotFound, "URL_NOT_FOUND", "Short URL not found")
		return
	}

	h.cache.Set(r.Context(), id, url, 24*time.Hour)
	http.Redirect(w, r, url, http.StatusFound)
}

func (h *Handler) GetUserURLs(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		api.RespondError(w, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "Only GET allowed")
		return
	}

	userID, ok := r.Context().Value("user_id").(string)
	if !ok {
		api.RespondError(w, http.StatusInternalServerError, "CONTEXT_ERROR", "Invalid user_id in context")
		return
	}

	urls, err := h.service.GetUserURLs(userID)
	if err != nil {
		api.RespondError(w, http.StatusInternalServerError, "CONTEXT_ERROR", err.Error())
		return
	}

	api.RespondSuccess(w, http.StatusOK, urls)
}

func (h *Handler) DeleteURL(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodDelete {
		api.RespondError(w, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "Only DELETE allowed")
		return
	}

	userID, ok := r.Context().Value("user_id").(string)
	if !ok {
		api.RespondError(w, http.StatusInternalServerError, "CONTEXT_ERROR", "Invalid user_id in context")
		return
	}

	id := r.URL.Path[len("/user/urls/"):]

	err := h.service.DeleteURL(userID, id)
	if err != nil {
		if err.Error() == "unauthorized" {
			api.RespondError(w, http.StatusUnauthorized, "UNAUTHORIZED", "Unauthorized")
			return
		}
		api.RespondError(w, http.StatusNotFound, "URL_NOT_FOUND", err.Error())
		return
	}

	api.RespondSuccess(w, http.StatusOK, map[string]string{
		"message": "URL deleted",
	})
}
