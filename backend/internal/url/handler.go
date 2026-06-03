package url

import (
	"encoding/json"
	"net/http"
	"path"
	"strings"
	"time"

	"urlshortener/backend/internal/api"
	"urlshortener/backend/internal/cache"
	"urlshortener/backend/internal/config"
)

type Handler struct {
	service *Service
	cache   *cache.RedisCache
	cfg     *config.Config
}

func NewHandler(service *Service, cache *cache.RedisCache, cfg *config.Config) *Handler {
	return &Handler{
		service: service,
		cache:   cache,
		cfg:     cfg,
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

	if err := api.ValidateURL(body.URL); err != nil {
		api.RespondError(w, http.StatusBadRequest, "INVALID_URL", err.Error())
		return
	}

	id, err := h.service.Shorten(userID, body.URL)

	if err != nil {
		api.RespondError(w, http.StatusInternalServerError, "SERVICE_ERROR", "Something went wrong")
		return
	}

	api.RespondSuccess(w, http.StatusCreated, map[string]string{
		"short_url": h.cfg.BaseURL + "/r/" + id,
	})
}

func (h *Handler) Redirect(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		api.RespondError(w, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "Only GET allowed")
		return
	}

	id := strings.TrimPrefix(r.URL.Path, "/r/")

	if id == "" || id == "r" {
		api.RespondError(w, http.StatusBadRequest, "INVALID_URL_ID", "Invalid URL ID")
		return
	}

	cachedURL, err := h.cache.Get(r.Context(), id)
	if err == nil && cachedURL != "" {
		_ = h.service.IncrementClicks(id)
		http.Redirect(w, r, cachedURL, http.StatusFound)
		return
	}

	url, ok := h.service.Resolve(id)

	if !ok {
		api.RespondError(w, http.StatusNotFound, "URL_NOT_FOUND", "Short URL not found")
		return
	}

	_ = h.cache.Set(r.Context(), id, url, 24*time.Hour)

	_ = h.service.IncrementClicks(id)
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

	id := path.Base(r.URL.Path)

	if id == "" || id == "user" || id == "urls" {
		api.RespondError(w, http.StatusBadRequest, "INVALID_URL_ID", "Invalid URL ID")
		return
	}

	err := h.service.DeleteURL(userID, id)
	if err != nil {
		switch err.Error() {
		case "unauthorized":
			api.RespondError(w, http.StatusUnauthorized, "UNAUTHORIZED", "You can only delete your own URLs")
		case "not_found":
			api.RespondError(w, http.StatusNotFound, "URL_NOT_FOUND", "URL not found")
		default:
			api.RespondError(w, http.StatusInternalServerError, "DELETE_ERROR", err.Error())
		}
		return
	}

	api.RespondSuccess(w, http.StatusOK, map[string]string{
		"message": "URL deleted successfully",
	})
}
