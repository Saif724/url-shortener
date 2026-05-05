package url

import (
	"encoding/json"
	"net/http"
)

type Handler struct {
	service Service
}

func NewHandler(service *Service) *Handler {
	return &Handler{
		service: *service,
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

	json.NewDecoder(r.Body).Decode(&body)

	if body.URL == "" {
		http.Error(w, "URL required", http.StatusBadRequest)
		return
	}

	id := h.service.Shorten(body.URL)

	json.NewEncoder(w).Encode(map[string]string{
		"id": id,
	})
}

func (h *Handler) Redirect(w http.ResponseWriter, r *http.Request) {
	id := r.URL.Path[len("/r/"):]

	url, ok := h.service.Resolve(id)

	if !ok {
		http.NotFound(w, r)
		return
	}

	http.Redirect(w, r, url, http.StatusFound)
}
