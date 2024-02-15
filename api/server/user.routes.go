// List of user based route handlers
package server

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/Azpect3120/LookSee/api/database"
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
		Log(r, http.StatusMethodNotAllowed)
		return
	}

	// Read request body
	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Error reading request body", http.StatusBadRequest)
		Log(r, http.StatusBadRequest)
		return
	}

	// Parse data from json to an object
	var req LoginRequest
	if err := json.Unmarshal(body, &req); err != nil {
		http.Error(w, "Error unmarshalling JSON", http.StatusBadRequest)
		Log(r, http.StatusBadRequest)
		return
	}

	// Update the user in the session
	SetSessionKeyValue(s, "user", req)

	// Send response
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(fmt.Sprintf("Logging in as: %s", req.Name)))

	// Log to console
	Log(r, http.StatusOK)
}

// Attempts to log the user into the app.
// When successful, their user object will updated
// in the session.
func AttemptLogin(w http.ResponseWriter, r *http.Request, s *model.Server) {
	// Ensure method is POST
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed.", http.StatusMethodNotAllowed)
		Log(r, http.StatusMethodNotAllowed)
		return
	}

	// Parse the form data
	if err := r.ParseForm(); err != nil {
		http.Error(w, "Error parsing form.", http.StatusBadRequest)
		Log(r, http.StatusBadRequest)
		return
	}

	// Get data from user input
	username := r.FormValue("username")
	password := r.FormValue("password")

	// Validate user input
	valid, user, err := database.ValidateLogin(s.Database, username, password)
	if err != nil {
		http.Error(w, "Error validating login.", http.StatusInternalServerError)
		Log(r, http.StatusInternalServerError)
		return
	}

	var res []byte
	var status int

	// Return response
	if valid {
		// Add user to session
		SetSessionKeyValue(s, "User", *user)
		res, err = json.Marshal(model.AttemptLoginResponse{Status: http.StatusOK, Message: "User was logged in."})
		status = http.StatusOK
	} else {
		res, err = json.Marshal(model.AttemptLoginResponse{Status: http.StatusBadRequest, Message: "Login credentials were invalid."})
		status = http.StatusBadRequest
	}

	// Encode response
	if err != nil {
		http.Error(w, "Error encoding response", http.StatusInternalServerError)
		Log(r, http.StatusInternalServerError)
		return
	}

	// Send response
	w.WriteHeader(status)
	w.Header().Set("Content-Type", "application/json")
	w.Write(res)

	// Log to console
	Log(r, status)
}
