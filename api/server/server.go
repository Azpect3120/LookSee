package server

import (
	"fmt"
	"net/http"

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
			Endpoints: make(map[string]func(http.ResponseWriter, *http.Request)),
			Database:  db,
			Session:   sessions.NewSession(store, "session"),
		}, nil
	}
}

func NewEndpoint(server *model.Server, endpoint string, handler func(http.ResponseWriter, *http.Request)) {
	server.Endpoints[endpoint] = handler
}

func Listen(server *model.Server) error {
	for endpoint, handler := range server.Endpoints {
		fmt.Printf("Routes to %s were loaded\n", endpoint)
		server.Router.HandleFunc(endpoint, handler)
	}

	fmt.Printf("Server is live on port %d...\n\n", server.Port)
	return http.ListenAndServe(fmt.Sprintf(":%d", server.Port), server.Router)
}
