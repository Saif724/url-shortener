CREATE INDEX idx_urls_user_id ON urls(user_id);
CREATE INDEX idx_users_email ON users(email UNIQUE);