ALTER TABLE urls 
ADD COLUMN IF NOT EXISTS user_id TEXT NOT NULL;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'fk_user_id'
    ) THEN
        ALTER TABLE urls
        ADD CONSTRAINT fk_user_id
        FOREIGN KEY (user_id) REFERENCES users(id);
    END IF;
END $$;