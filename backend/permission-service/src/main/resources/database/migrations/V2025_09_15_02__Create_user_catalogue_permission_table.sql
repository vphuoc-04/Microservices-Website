CREATE TABLE user_catalogue_permission (
    user_catalogue_id BIGINT UNSIGNED NOT NULL,
    permission_id BIGINT NOT NULL,
    PRIMARY KEY (user_catalogue_id, permission_id)
); 