package database

import (
	"time"

	"github.com/Azpect3120/LookSee/api/model"
)

// Create an upload in the database.
// The upload stores the file in the MSS
// which can be accessed later and displayed.
// GET routes should bounce from endpoints here
// to endpoints in the MSS to find and retrieve
// URLs and information.
func CreateUpload(db *model.Database, id, mssFolderID, mssMediaID, mssPath string, created time.Time) (*model.Upload, error) {
	// Create SQL statement
	stmt, err := db.Conn.Prepare("INSERT INTO uploads (id, mss_folder_id, mss_media_id, mss_Path, created) VALUES ($1, $2, $3, $4, $5) RETURNING *;")
	if err != nil {
		return &model.Upload{}, err
	}
	defer stmt.Close()

	// Create upload object
	var u *model.Upload = &model.Upload{}

	// Execute statement
	if err := stmt.QueryRow(id, mssFolderID, mssMediaID, mssPath, created).Scan(&u.ID, &u.FolderID, &u.MediaID, &u.MssPath, &u.Created); err != nil {
		return &model.Upload{}, err
	}

	// Return upload object
	return u, nil
}

// Create a post in the database.
// The posts themselves don't store
// much actual video data, but the data
// is stored in the 'upload' which
// information can be retrieved from
// the MSS for more detailed information.
func CreatePost(db *model.Database, id, author, title, textContent string, upload *model.Upload, created time.Time) (*model.Post, error) {
	// Create SQL statement
	stmt, err := db.Conn.Prepare(
		`INSERT INTO 
		posts (id, author, title, video_content, text_content, created) 
		VALUES ($1, $2, $3, $4, $5, $6) 
		RETURNING id, author, title, text_content, created;`)
	if err != nil {
		return &model.Post{}, err
	}
	defer stmt.Close()

	// Create upload object
	var p *model.Post = &model.Post{Upload: *upload}

	// Execute statement
	if err := stmt.QueryRow(id, author, title, upload.ID, textContent, created).Scan(&p.ID, &p.Author, &p.Title, &p.TextContent, &p.Created); err != nil {
		return &model.Post{}, err
	}

	// Return upload object
	return p, nil
}

// Return an array of posts
func GetPosts(db *model.Database, count, page int) ([]*model.Post, error) {
	// Calculate offset
	offset := (page - 1) * count

	// Create SQL statement
	stmt, err := db.Conn.Prepare(`
		SELECT posts.*, uploads.*
		FROM posts INNER JOIN uploads on posts.video_content = uploads.id
		ORDER BY posts.created DESC
		OFFSET $1 LIMIT $2;
	`)
	if err != nil {
		return []*model.Post{}, err
	}
	defer stmt.Close()

	// Create upload object
	var p []*model.Post = make([]*model.Post, 0)

	// Execute statement
	rows, err := stmt.Query(offset, count)
	if err != nil {
		return []*model.Post{}, err
	}

	defer rows.Close()

	// Parse rows
	for rows.Next() {
		post := &model.Post{}
		upload := &model.Upload{}
		rows.Scan(
			&post.ID,
			&post.Author,
			&post.Title,
			&post.Upload.ID,
			&post.TextContent,
			&post.Created,
			&upload.ID,
			&upload.FolderID,
			&upload.MediaID,
			&upload.MssPath,
			&upload.Created,
		)
		post.Upload = *upload
		p = append(p, post)
	}

	// Return upload object
	return p, nil

}

func GetPostById(db *model.Database, id string) {

}
