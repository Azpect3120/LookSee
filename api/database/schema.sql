-- UUID extension for use in creating and storing
-- UUID value types
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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
    author TEXT,
    title TEXT,
    video_content UUID REFERENCES uploads(id) UNIQUE,
    text_content TEXT,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- @block
SELECT posts.*, uploads.*
FROM posts INNER JOIN uploads on posts.video_content = uploads.id
ORDER BY posts.created DESC
OFFSET 0 LIMIT 5;