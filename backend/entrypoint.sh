#!/bin/sh

set -e

echo "Starting migrations..."

migrate -path /app/backend/db/migrations \
  -database "$DATABASE_URL" \
  up

echo "Migrations completed"

exec /app/main