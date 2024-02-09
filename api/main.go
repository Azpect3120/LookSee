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
	server.NewEndpoint(s, "GET", "/session", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			http.Error(w, "Method not allowed.", http.StatusMethodNotAllowed)
			server.Log(r, http.StatusMethodNotAllowed)
			return
		}
		data := fmt.Sprintf("%+v", server.GetSessionData(s))
		w.Write([]byte(data))

		// Log to console
		server.Log(r, http.StatusOK)
	})

	// POST `/login`
	// Logs the user in with their name
	// IS NOT SECURE, just built for MVP purposes
	server.NewEndpoint(s, "POST", "/login", func(w http.ResponseWriter, r *http.Request) {
		server.LoginWithName(w, r, s)
	})

	// GET `/posts`
	// Get a list of recent posts
	//
	// POST `/posts`
	// Creates a new post
	// Name of the file uploaded should be `video_upload`
	// Fields:
	//	author string
	//	title string
	//	text_content string
	server.NewEndpoint(s, "GET", "/posts", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			server.GetPosts(w, r, s)
		case http.MethodPost:
			server.CreatePost(w, r, s)
		default:
			http.Error(w, "Method not allowed.", http.StatusMethodNotAllowed)
			server.Log(r, http.StatusMethodNotAllowed)
		}
	})

	// GET `/posts/:id`
	// Gets a post via its `id` specified in the URL
	server.NewEndpoint(s, "GET", "/posts/{id}", func(w http.ResponseWriter, r *http.Request) {
		server.GetPostById(w, r, s)
	})

	server.Listen(s)
}
