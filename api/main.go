package main

import (
	"fmt"
	"net/http"

	"github.com/Azpect3120/LookSee/api/server"
)

type User struct {
	ID       int
	Username string
	Password string
}

const CONN_STRING string = "postgres://sthrthra:npQWeHYhjir04iXWNaCbRujOsGohMKRV@kashin.db.elephantsql.com/sthrthra"

func main() {
	s, err := server.Create(3000, CONN_STRING)
	if err != nil {
		println(err.Error())
	}

	// Example session endpoint
	server.NewEndpoint(s, "/session", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			http.Error(w, "Method not allowed.", http.StatusMethodNotAllowed)
			return
		}
		data := fmt.Sprintf("%+v", server.GetSessionData(s))
		w.Write([]byte(data))
	})

	// POST `/login`
	// Logs the user in with their name
	// IS NOT SECURE, just built for MVP purposes
	server.NewEndpoint(s, "/login", func(w http.ResponseWriter, r *http.Request) {
		server.LoginWithName(w, r, s)
	})

	server.Listen(s)
}
