package server

import (
	"bytes"
	"crypto/tls"
	"encoding/json"
	"fmt"
	"io"
	"mime/multipart"
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
	// Parse the multipart form data
	err := r.ParseMultipartForm(50 << 20) // 50 MB
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		Log(r, http.StatusBadRequest)
		return
	}

	// Get file from request
	file, header, err := r.FormFile("video_upload")
	if err != nil {
		http.Error(w, "Error retrieving video file.", http.StatusBadRequest)
		Log(r, http.StatusBadRequest)
		return
	}
	defer file.Close()

	// Create a new buffer to store the multipart content
	var requestBody bytes.Buffer
	writer := multipart.NewWriter(&requestBody)

	// Get the name of the file somehow???
	// MUST INCLUDE EXT
	var filename string = header.Filename

	// Create a form field for the file
	part, err := writer.CreateFormFile("media_upload", filename)
	if err != nil {
		http.Error(w, "Error creating form file.", http.StatusInternalServerError)
		Log(r, http.StatusInternalServerError)
		return
	}

	// Copy the file content to the form field
	_, err = io.Copy(part, file)
	if err != nil {
		http.Error(w, "Error copying file content.", http.StatusInternalServerError)
		Log(r, http.StatusInternalServerError)
		return
	}

	// Close the multipart writer
	writer.Close()

	// Setup http client to override SSL issue with my stupid server
	httpClient := &http.Client{
		Transport: &http.Transport{
			TLSClientConfig: &tls.Config{InsecureSkipVerify: true},
		},
	}

	// Send data to the Media Storage Server
	folderID := "e8c730cc-687c-40fc-bd3f-babfe91ebe64" // Temp folder
	mssURL := fmt.Sprintf("https://mss.gophernest.net/v1/images/%s", folderID)
	response, err := httpClient.Post(mssURL, writer.FormDataContentType(), &requestBody)
	if err != nil {
		http.Error(w, "Error sending content to the MSS.", http.StatusInternalServerError)
		Log(r, http.StatusInternalServerError)
		return
	}
	defer response.Body.Close()

	// Parse response from MSS
	mssBody, err := io.ReadAll(response.Body)
	if err != nil {
		http.Error(w, "Error reading response body", http.StatusInternalServerError)
		Log(r, http.StatusInternalServerError)
		return
	}

	var mssRes model.MSSResponse
	if err := json.Unmarshal(mssBody, &mssRes); err != nil {
		http.Error(w, "Error decoding JSON", http.StatusInternalServerError)
		Log(r, http.StatusInternalServerError)
		return
	}

	// Copy response from the Media Storage Server to the response writer
	// w.WriteHeader(response.StatusCode)
	// _, err = io.Copy(w, response.Body)
	// if err != nil {
	// 	http.Error(w, "Error writing response to client", http.StatusInternalServerError)
	// 	Log(r, http.StatusInternalServerError)
	// 	return
	// }

	// Log to console
	Log(r, response.StatusCode)
}
