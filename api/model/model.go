package model

import (
	"database/sql"
	"net/http"
	"time"

	"github.com/gorilla/mux"
	"github.com/gorilla/sessions"
)

type Database struct {
	Conn             *sql.DB
	ConnectionString string
}

type Server struct {
	Router *mux.Router
	Port   int
	// Array will store [ "/endpoint", "METHOD" ]
	Endpoints map[[2]string]func(http.ResponseWriter, *http.Request)
	Database  *Database
	Session   *sessions.Session
}

type Upload struct {
	ID       string
	FolderID string
	MediaID  string
	Created  time.Time
}

type Post struct {
	ID          string
	Author      string
	Title       string
	Upload      Upload
	TextContent string
	Created     time.Time
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
