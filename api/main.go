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

func main() {
	s, err := server.Create(3000)
	if err != nil {
		println(err.Error())
	}

	server.NewEndpoint(s, "/session", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			http.Error(w, "Method not allowed.", http.StatusMethodNotAllowed)
			return
		}
		data := fmt.Sprintf("%+v", server.GetSessionData(s))
		w.Write([]byte(data))
	})

	server.Listen(s)
}
