ALTER TABLE user_catalogues
ADD COLUMN created_by BIGINT UNSIGNED DEFAULT NULL,
ADD COLUMN updated_by BIGINT UNSIGNED DEFAULT NULL;

ALTER TABLE user_catalogues
ADD CONSTRAINT fk_user_catalogues_created_by
FOREIGN KEY (created_by)
REFERENCES users(id)
ON DELETE CASCADE;

ALTER TABLE user_catalogues
ADD CONSTRAINT fk_user_catalogues_updated_by
FOREIGN KEY (updated_by)
REFERENCES users(id)
ON DELETE SET NULL;