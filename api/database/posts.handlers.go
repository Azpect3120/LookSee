package database

import (
	"time"

	"github.com/Azpect3120/LookSee/api/model"
)

func CreateUpload(db *model.Database, id, mssFolderID, mssMediaID string, created time.Time) (*model.Upload, error) {
	// Create SQL statement
	stmt, err := db.Conn.Prepare("INSERT INTO uploads (id, mss_folder_id, mss_media_id, created) VALUES ($1, $2, $3, $4) RETURNING *;")
	if err != nil {
		return &model.Upload{}, err
	}
	defer stmt.Close()

	// Create upload object
	var u *model.Upload = &model.Upload{}

	// Execute statement
	if err := stmt.QueryRow(id, mssFolderID, mssMediaID, created).Scan(u.ID, u.FolderID, u.MediaID, u.Created); err != nil {
		return &model.Upload{}, err
	}

	// Return upload object
	return u, nil
}

func CreatePost(db *model.Database, id, author, title, textContent string, upload *model.Upload, created time.Time) (*model.Post, error) {
	return nil, nil
}

func GetPosts(db *model.Database) {

}

func GetPostById(db *model.Database, id string) {

}
