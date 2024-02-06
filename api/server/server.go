package server

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/Azpect3120/LookSee/api/database"
	"github.com/Azpect3120/LookSee/api/model"
	"github.com/gorilla/mux"
	"github.com/gorilla/sessions"
)

const SESSION_KEY string = "iruabjinajabkjabgmabgaj"

func Create(port int, connectionString string) (*model.Server, error) {
	if db, err := database.Create(connectionString); err != nil {
		return nil, err
	} else {
		store := sessions.NewCookieStore([]byte(SESSION_KEY))
		return &model.Server{
			Router:    mux.NewRouter(),
			Port:      port,
			Endpoints: make(map[[2]string]func(http.ResponseWriter, *http.Request)),
			Database:  db,
			Session:   sessions.NewSession(store, "session"),
		}, nil
	}
}

func NewEndpoint(server *model.Server, method, endpoint string, handler func(http.ResponseWriter, *http.Request)) {
	server.Endpoints[[2]string{endpoint, strings.ToUpper(method)}] = handler
}

func Listen(server *model.Server) error {
	for endpoint, handler := range server.Endpoints {
		fmt.Printf("%s to %s was loaded.\n", endpoint[1], endpoint[0])
		server.Router.HandleFunc(endpoint[0], handler)
	}

	fmt.Printf("Server is live on port %d...\n\n", server.Port)
	return http.ListenAndServe(fmt.Sprintf(":%d", server.Port), server.Router)
}
