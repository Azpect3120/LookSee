-- UUID extension for use in creating and storing
-- UUID value types
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS uploads;
DROP TABLE IF EXISTS users;

-- Users table which will store user data
-- Likes will store an array of post_ids
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4() UNIQUE,
    username TEXT UNIQUE,
    password TEXT,
    likes UUID[],
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- @block
INSERT INTO users (username, password, likes) VALUES ('azpect', 'root', array[]::UUID[]);

-- @block
SELECT * FROM users WHERE username = 'azpect' AND password = 'root';

-- Uploads table which will store each video
-- uploaded and map it to a post.
CREATE TABLE IF NOT EXISTS uploads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4() UNIQUE,
    mss_folder_id UUID,
    mss_media_id UUID UNIQUE,
    mss_path TEXT,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Post table for storing the users posts
CREATE TABLE IF NOT EXISTS posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4() UNIQUE,
    author UUID REFERENCES users(id),
    title TEXT,
    video_content UUID REFERENCES uploads(id),
    text_content TEXT,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4() UNIQUE,
    user_id UUID REFERENCES users(id),
    post_id UUID REFERENCES posts(id),
    content TEXT,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- @block
SELECT 
    posts.id as p_id,
    posts.author,
    posts.title,
    posts.video_content,
    posts.text_content,
    posts.created as p_created,
    uploads.id as upload_id,
    uploads.mss_folder_id,
    uploads.mss_media_id,
    uploads.mss_path,
    uploads.created as upload_created,
    users.id as user_id,
    users.username,
    users.password,
    users.created as user_created
FROM posts INNER JOIN uploads on posts.video_content = uploads.id
INNER JOIN users ON posts.author = users.id
ORDER BY posts.created DESC
OFFSET 0 LIMIT 1;

-- @block
SELECT posts.*, uploads.*
FROM posts INNER JOIN uploads on posts.video_content = uploads.id
WHERE posts.id = 'da175d69-d2f8-4b6f-8d54-8d9278f6e216';

-- @block
SELECT posts.id as p_id,
    posts.author,
    posts.title,
    posts.video_content,
    posts.text_content,
    posts.created as p_created,
    uploads.id as upload_id,
    uploads.mss_folder_id,
    uploads.mss_media_id,
    uploads.mss_path,
    uploads.created as upload_created,
    users.id as user_id,
    users.username,
    users.password,
    users.created as user_created
FROM posts
    INNER JOIN uploads on posts.video_content = uploads.id
    INNER JOIN users ON posts.author = users.id
WHERE posts.id = 'c8c83e19-25a1-4c9f-ab72-6a1672549d12';

-- @block
SELECT * FROM users;
SELECT * FROM posts;
SELECT * FROM uploads;