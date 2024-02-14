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
SELECT posts.*, uploads.*
FROM posts INNER JOIN uploads on posts.video_content = uploads.id
ORDER BY posts.created DESC
OFFSET 0 LIMIT 5;

-- @block
SELECT posts.*, uploads.*
FROM posts INNER JOIN uploads on posts.video_content = uploads.id
WHERE posts.id = 'da175d69-d2f8-4b6f-8d54-8d9278f6e216';

-- @block
SELECT * FROM users;
SELECT * FROM posts;
SELECT * FROM uploads;