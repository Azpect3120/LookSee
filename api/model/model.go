package model

import (
	"database/sql"
	"net/http"

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
