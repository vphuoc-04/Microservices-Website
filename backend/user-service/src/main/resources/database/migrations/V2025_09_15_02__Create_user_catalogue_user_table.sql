CREATE TABLE user_catalogue_user (
    user_id BIGINT UNSIGNED NOT NULL,
    user_catalogue_id BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY (user_id, user_catalogue_id)
); 