package server

import (
	"fmt"
	"net/http"

	"github.com/gorilla/mux"

	"github.com/Azpect3120/LookSee/api/model"
)

func GetPosts(w http.ResponseWriter, r *http.Request, s *model.Server) {
	// Ensure method is GET
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed.", http.StatusMethodNotAllowed)
		Log(r, http.StatusMethodNotAllowed)
		return
	}

	// Send response
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Returning a list."))

	// Log to console
	Log(r, http.StatusOK)
}

func GetPostById(w http.ResponseWriter, r *http.Request, s *model.Server) {
	// Ensure method is GET
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed.", http.StatusMethodNotAllowed)
		Log(r, http.StatusMethodNotAllowed)
		return
	}

	// Get ID if valid
	vars := mux.Vars(r)
	id := vars["id"]

	// Send response
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(fmt.Sprintf("ID Provided: %s", id)))

	// Log to console
	Log(r, http.StatusOK)
}

func CreatePost(w http.ResponseWriter, r *http.Request, s *model.Server) {
	// Log to console
	Log(r, http.StatusOK)
}
