package server

import (
	"bytes"
	"crypto/tls"
	"encoding/json"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"strconv"
	"time"

	"github.com/google/uuid"
	"github.com/gorilla/mux"

	"github.com/Azpect3120/LookSee/api/database"
	"github.com/Azpect3120/LookSee/api/model"
)

// Number of posts returned
const RETURN_COUNT int = 10

// Returns an array of posts
func GetPosts(w http.ResponseWriter, r *http.Request, s *model.Server) {
	// Ensure method is GET
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed.", http.StatusMethodNotAllowed)
		Log(r, http.StatusMethodNotAllowed)
		return
	}

	// Get page from URL
	page := r.URL.Query().Get("page")

	pageNum, err := strconv.Atoi(page)
	if err != nil {
		http.Error(w, "Error parsing page input.", http.StatusInternalServerError)
		Log(r, http.StatusInternalServerError)
		return
	}

	// Get posts from database
	posts, err := database.GetPosts(s.Database, RETURN_COUNT, pageNum)
	if err != nil {
		println(err.Error())
		http.Error(w, "Error getting posts.", http.StatusBadRequest)
		Log(r, http.StatusBadRequest)
		return
	}

	// Encode post to JSON
	json, err := json.Marshal(posts)
	if err != nil {
		http.Error(w, "Error marshaling posts.", http.StatusInternalServerError)
		Log(r, http.StatusInternalServerError)
		return
	}

	// Send response
	w.WriteHeader(http.StatusCreated)
	w.Header().Set("Content-Type", "application/json")
	w.Write(json)

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

// Creates a post in the database
// Data should be sent in the form
// e.g. Response:
//
//	{
//	  "status": 201,
//	  "post": {
//	    "ID": "bf0630b7-875f-4312-a74c-3a3b2e98ae67",
//	    "Author": "hayden",
//	    "Title": "I promise this place is good\n",
//	    "Upload": {
//	      "ID": "d512ab7f-d944-49dd-99e2-19541a756b9c",
//	      "FolderID": "e8c730cc-687c-40fc-bd3f-babfe91ebe64",
//	      "MediaID": "2d0005e4-1044-47f1-a066-5ce1e08af606",
//	      "MssPath": "/uploads/e8c730cc-687c-40fc-bd3f-babfe91ebe64/2d0005e4-1044-47f1-a066-5ce1e08af606.mp4",
//	      "Created": "2024-02-13T19:08:17.299403Z"
//	    },
//	    "TextContent": "go here broski",
//	    "Created": "2024-02-13T19:08:17.414022Z"
//	  }
//	}
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

	// Read response from MSS
	mssBody, err := io.ReadAll(response.Body)
	if err != nil {
		http.Error(w, "Error reading response body", http.StatusInternalServerError)
		Log(r, http.StatusInternalServerError)
		return
	}

	// Parse response from MSS
	var mssRes model.MSSResponse
	if err := json.Unmarshal(mssBody, &mssRes); err != nil {
		http.Error(w, "Error decoding JSON", http.StatusInternalServerError)
		Log(r, http.StatusInternalServerError)
		return
	}

	// Create upload in database
	upload, err := database.CreateUpload(s.Database, uuid.NewString(), mssRes.Image.FolderID, mssRes.Image.ID, mssRes.Image.Path, time.Now().UTC())
	if err != nil {
		println(err.Error())
		http.Error(w, "Error creating upload in database", http.StatusInternalServerError)
		Log(r, http.StatusInternalServerError)
		return
	}

	// Get data from user input
	var (
		author       string = r.FormValue("author")
		title        string = r.FormValue("title")
		text_content string = r.FormValue("text_content")
	)

	// Create post in database
	post, err := database.CreatePost(s.Database, uuid.NewString(), author, title, text_content, upload, time.Now().UTC())
	if err != nil {
		println(err.Error())
		http.Error(w, "Error creating post in database", http.StatusInternalServerError)
		Log(r, http.StatusInternalServerError)
		return
	}

	// Encode struct to JSON
	jsonRes, err := json.Marshal(model.CreatePostResponse{Status: http.StatusCreated, Post: post})
	if err != nil {
		http.Error(w, "Error encoding response", http.StatusInternalServerError)
		Log(r, http.StatusInternalServerError)
		return
	}

	// Return post as the response
	w.WriteHeader(http.StatusCreated)
	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonRes)

	// Log to console
	Log(r, http.StatusCreated)
}
