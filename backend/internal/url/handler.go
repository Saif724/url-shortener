package url

import (
	"encoding/json"
	"net/http"
	"net/url"
	"time"
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
		http.Error(w, "Only POST allowed", http.StatusMethodNotAllowed)
		return
	}

	var body struct {
		URL string `json:"url"`
	}

	err := json.NewDecoder(r.Body).Decode(&body)

	if err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	if body.URL == "" {
		http.Error(w, "URL required", http.StatusBadRequest)
		return
	}

	_, err = url.ParseRequestURI(body.URL)

	if err != nil {
		http.Error(w, "Invalid URL", http.StatusBadRequest)
		return
	}
	id, err := h.service.Shorten(body.URL)

	if err != nil {
		http.Error(w, "Something went wrong", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)

	err = json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"data": map[string]string{
			"short_url": "http://localhost:8080/r/" + id,
		},
	})

	if err != nil {
		http.Error(w, "Something went wrong", http.StatusInternalServerError)
		return
	}
}

func (h *Handler) Redirect(w http.ResponseWriter, r *http.Request) {
	id := r.URL.Path[len("/r/"):]

	cachedURL, err := h.cache.Get(r.Context(), id)
	if err == nil && cachedURL != "" {
		http.Redirect(w, r, cachedURL, http.StatusFound)
		return
	}

	url, ok := h.service.Resolve(id)

	if !ok {
		http.NotFound(w, r)
		return
	}

	h.cache.Set(r.Context(), id, url, 24*time.Hour)
	http.Redirect(w, r, url, http.StatusFound)
}
