package database

import (
	"time"

	"github.com/Azpect3120/LookSee/api/model"
	"github.com/google/uuid"
	_ "github.com/lib/pq"
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
func CreatePost(db *model.Database, id, author, title, textContent, address string, upload *model.Upload, created time.Time) (*model.Post, error) {
	// Create SQL statement
	stmt, err := db.Conn.Prepare(
		`WITH inserted_post AS (
			INSERT INTO posts (id, author, title, video_content, text_content, address, created) 
			VALUES  ($1, $2, $3, $4, $5, $6, $7) 
			RETURNING *
		)
		SELECT 
			p.id AS post_id,
			p.title AS post_title,
			p.text_content AS post_text_content,
      p.address,
			p.created AS post_created,
			u.id AS user_id, 
			u.username, 
			u.likes,
			u.created 	
		FROM 
		inserted_post p 
		JOIN users u ON p.author = u.id;`)
	if err != nil {
		return &model.Post{}, err
	}
	defer stmt.Close()

	// Create upload object
	var p *model.Post = &model.Post{Upload: *upload}
	var likes []byte

	// Execute statement
	if err := stmt.QueryRow(id, author, title, upload.ID, textContent, address, created).Scan(
		&p.ID,
		&p.Title,
		&p.TextContent,
    &p.Address,
		&p.Created,
		&p.Author.ID,
		&p.Author.Username,
		&likes,
		&p.Author.Created,
	); err != nil {
		return &model.Post{}, err
	}

	// Convert byte array to uuid array
	p.Author.Likes = make([]string, 0)
	for _, uuidBytes := range likes {
		if uuid.Validate(string(uuidBytes)) == nil {
			uuidString := string(uuidBytes)
			p.Author.Likes = append(p.Author.Likes, uuidString)
		}
	}

	// Return upload object
	return p, nil
}

// Return an array of posts.
// The posts are returned in order by
// the date they were uploaded. Count
// and page are used for pagination.
func GetPosts(db *model.Database, count, page int) ([]*model.Post, error) {
	// Calculate offset
	offset := (page - 1) * count

	// Create SQL statement
	stmt, err := db.Conn.Prepare(`
		SELECT 
			posts.id as p_id,
			posts.author,
			posts.title,
			posts.video_content,
			posts.text_content,
      posts.address,
			posts.created as p_created,
			uploads.id as upload_id,
			uploads.mss_folder_id,
			uploads.mss_media_id,
			uploads.mss_path,
			uploads.created as upload_created,
			users.id as user_id,
			users.username,
			users.created as user_created
		FROM posts INNER JOIN uploads on posts.video_content = uploads.id
		INNER JOIN users ON posts.author = users.id
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
		user := &model.User{}
		rows.Scan(
			&post.ID,
			&post.Author.ID,
			&post.Title,
			&post.Upload.ID,
			&post.TextContent,
      &post.Address,
			&post.Created,
			&upload.ID,
			&upload.FolderID,
			&upload.MediaID,
			&upload.MssPath,
			&upload.Created,
			&user.ID,
			&user.Username,
			&user.Created,
		)
		post.Upload = *upload
		post.Author = *user
		p = append(p, post)
	}

	// Return upload object
	return p, nil

}

// Get a post from the database via the ID
func GetPostById(db *model.Database, id string) (*model.Post, error) {
	// Create SQL statement
	stmt, err := db.Conn.Prepare(`
		SELECT 
			posts.id as p_id,
			posts.author,
			posts.title,
			posts.video_content,
      posts.text_content,
      posts.address,
			posts.created as p_created,
			uploads.id as upload_id,
			uploads.mss_folder_id,
			uploads.mss_media_id,
			uploads.mss_path,
			uploads.created as upload_created,
			users.id as user_id,
			users.username,
			users.created as user_created
		FROM posts INNER JOIN uploads on posts.video_content = uploads.id
		INNER JOIN users ON posts.author = users.id
		WHERE posts.id = $1;`)
	if err != nil {
		return &model.Post{}, err
	}
	defer stmt.Close()

	// Create upload object
	post := &model.Post{Upload: model.Upload{}, Author: model.User{}}

	// Execute statement
	err = stmt.QueryRow(id).Scan(
		&post.ID,
		&post.Author.ID,
		&post.Title,
		&post.Upload.ID,
		&post.TextContent,
    &post.Address,
		&post.Created,
		&post.Upload.ID,
		&post.Upload.FolderID,
		&post.Upload.MediaID,
		&post.Upload.MssPath,
		&post.Upload.Created,
		&post.Author.ID,
		&post.Author.Username,
		&post.Author.Created,
	)
	if err != nil {
		return &model.Post{}, err
	}

	// Return upload object
	return post, nil
}
