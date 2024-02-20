package model

import (
	"database/sql"
	"net/http"
	"time"

	"github.com/gorilla/mux"
)

type Database struct {
	Conn             *sql.DB
	ConnectionString string
}

type Server struct {
	Router    *mux.Router
	Port      int
	Endpoints map[string]func(http.ResponseWriter, *http.Request)
	Database  *Database
}

type User struct {
	ID       string    `json:"id"`
	Username string    `json:"username"`
	Password string    `json:"password"`
	Likes    []string  `json:"likes"`
	Created  time.Time `json:"created"`
}

type Upload struct {
	ID       string    `json:"id"`
	FolderID string    `json:"folderid"`
	MediaID  string    `json:"mediaid"`
	MssPath  string    `json:"msspath"`
	Created  time.Time `json:"created"`
}

type Post struct {
	ID          string    `json:"id"`
	Author      User      `json:"author"`
	Title       string    `json:"title"`
  Upload      Upload    `json:"upload"`
  Address     string    `json:"address"`
	TextContent string    `json:"text_content"`
	Created     time.Time `json:"created"`
}

type CreatePostResponse struct {
	Status int   `json:"status"`
	Post   *Post `json:"post"`
}

type AttemptLoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type AttemptLoginResponse struct {
	Status  int    `json:"status"`
	Message string `json:"message"`
	User    User   `json:"user"`
}

type MSSResponse struct {
	Image struct {
		ID         string `json:"ID"`
		FolderID   string `json:"FolderId"`
		Name       string `json:"Name"`
		Size       int    `json:"Size"`
		Format     string `json:"Format"`
		UploadedAt string `json:"UploadedAt"`
		Path       string `json:"Path"`
	} `json:"image"`
}
