-- Drop legacy img column; we now use img_id referencing upload-service logical ID
ALTER TABLE users DROP COLUMN img;

