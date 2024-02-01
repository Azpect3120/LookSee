package server

import (
	"fmt"
	"net/http"

	"github.com/Azpect3120/LookSee/api/database"
	"github.com/Azpect3120/LookSee/api/model"
	"github.com/gorilla/mux"
	"github.com/gorilla/sessions"
)

const CONN_STRING string = "postgres://sthrthra:npQWeHYhjir04iXWNaCbRujOsGohMKRV@kashin.db.elephantsql.com/sthrthra"
const SESSION_KEY string = "iruabjinajabkjabgmabgaj"

func Create(port int) (*model.Server, error) {
	if db, err := database.Create(CONN_STRING); err != nil {
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
		fmt.Printf("%s was loaded.\n", endpoint)
		server.Router.HandleFunc(endpoint, handler)
	}

	fmt.Printf("Server is live on port %d...", server.Port)
	return http.ListenAndServe(fmt.Sprintf(":%d", server.Port), server.Router)
}
