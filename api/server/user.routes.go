// List of user based route handlers
package server

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/Azpect3120/LookSee/api/model"
)

type LoginRequest struct {
	Name string `json:"name"`
}

// Logs the user in using their name
// IS NOT SECURE, JUST USED FOR MVP PURPOSES
// Must be sent via a POST request
func LoginWithName(w http.ResponseWriter, r *http.Request, s *model.Server) {
	// Ensure method is POST
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed.", http.StatusMethodNotAllowed)
		return
	}

	// Read request body
	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Error reading request body", http.StatusBadRequest)
		return
	}

	// Parse data from json to an object
	var req LoginRequest
	if err := json.Unmarshal(body, &req); err != nil {
		http.Error(w, "Error unmarshalling JSON", http.StatusBadRequest)
		return
	}

	// Update the user in the session
	SetSessionKeyValue(s, "user", req)

	// Send response
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(fmt.Sprintf("Logging in as: %s", req.Name)))
}
