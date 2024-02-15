package database

import (
	"strings"

	"github.com/Azpect3120/LookSee/api/model"
	"github.com/google/uuid"
	_ "github.com/lib/pq"
)

// Validate the users login attempt
func ValidateLogin(db *model.Database, username, password string) (bool, *model.User, error) {
	// Prepare statement
	stmt, err := db.Conn.Prepare("SELECT id, username, likes, created FROM users WHERE username = $1 AND password = $2")
	if err != nil {
		return false, nil, err
	}
	defer stmt.Close()

	var u []*model.User = make([]*model.User, 0)

	// Execute statement
	rows, err := stmt.Query(strings.TrimSpace(username), strings.TrimSpace(password))
	if err != nil {
		return false, nil, err
	}
	defer rows.Close()

	// Parse rows
	for rows.Next() {
		var user *model.User = &model.User{}
		var likes []byte = make([]byte, 0)
		if err := rows.Scan(&user.ID, &user.Username, &likes, &user.Created); err != nil {
			return false, nil, err
		}

		// Convert byte array to uuid array
		user.Likes = make([]string, 0)
		for _, uuidBytes := range likes {
			if uuid.Validate(string(uuidBytes)) == nil {
				uuidString := string(uuidBytes)
				user.Likes = append(user.Likes, uuidString)
			}
		}
		u = append(u, user)
	}

	if len(u) > 0 {
		return true, u[0], nil
	} else {
		return false, nil, nil
	}
}
