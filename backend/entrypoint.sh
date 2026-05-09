#!/bin/sh

echo "Starting migrations..."
echo "DB_HOST: $DB_HOST"
echo "DB_PORT: $DB_PORT"
echo "DB_USER: $DB_USER"
echo "DB_NAME: $DB_NAME"

# Run migrations
migrate -path ./backend/db/migrations \
  -database "postgres://${DB_USER}:${DB_PASSWORD}@db:${DB_PORT}/${DB_NAME}?sslmode=disable" \
  up

echo "Migrations completed"

# Start app
./main