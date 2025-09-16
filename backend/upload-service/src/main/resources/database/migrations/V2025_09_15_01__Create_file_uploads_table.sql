-- Create file_uploads table
CREATE TABLE file_uploads (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    original_filename VARCHAR(255) NOT NULL,
    stored_filename VARCHAR(255) NOT NULL UNIQUE,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT NOT NULL,
    content_type VARCHAR(100) NOT NULL,
    file_extension VARCHAR(10),
    uploaded_by BIGINT,
    upload_category VARCHAR(100),
    description TEXT,
    is_public BOOLEAN NOT NULL DEFAULT FALSE,
    upload_type VARCHAR(50) NOT NULL DEFAULT 'OTHER',
    thumbnail_path VARCHAR(500),
    metadata JSON,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);
