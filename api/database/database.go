package database

import (
	"database/sql"
	"github.com/Azpect3120/LookSee/api/model"
	_ "github.com/lib/pq"
)

func Create(connString string) (*model.Database, error) {
	db := &model.Database{
		ConnectionString: connString,
		Conn:             nil,
	}

	conn, err := sql.Open("postgres", db.ConnectionString)
	if err != nil {
		return nil, err
	}

	db.Conn = conn

	if err := testConn(db); err != nil {
		return nil, err
	} else {
		return db, nil
	}
}

func testConn(db *model.Database) error {
	return db.Conn.Ping()
}
