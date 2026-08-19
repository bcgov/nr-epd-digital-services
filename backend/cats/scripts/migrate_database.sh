#! /bin/sh

set -eu

echo "Migrating database..."

srcdir="$(dirname "$0")"

# Source environment variables from local .env file if it exists
if [ -f "${srcdir}/../.env" ]; then
    . "${srcdir}/../.env"
fi

# Ensure all required environment variables are set.
if [ -z "${POSTGRES_HOST:-}" ]; then
    echo "POSTGRES_HOST is not set. Exiting..."
    exit 1
fi
if [ -z "${POSTGRES_PORT:-}" ]; then
    echo "POSTGRES_PORT is not set. Exiting..."
    exit 1
fi
if [ -z "${POSTGRES_DB_USERNAME:-}" ]; then
    echo "POSTGRES_DB_USERNAME is not set. Exiting..."
    exit 1
fi
if [ -z "${POSTGRES_DB_PASSWORD:-}" ]; then
    echo "POSTGRES_DB_PASSWORD is not set. Exiting..."
    exit 1
fi
if [ -z "${POSTGRES_DATABASE:-}" ]; then
    echo "POSTGRES_DATABASE is not set. Exiting..."
    exit 1
fi
if [ -z "${POSTGRES_DB_SCHEMA:-}" ]; then
    echo "POSTGRES_DB_SCHEMA is not set. Exiting..."
    exit 1
fi
echo "Environment loaded successfully."

echo "Running database migrations..."
npm run typeorm:run-migrations
echo "Database migrations completed successfully."

echo "Running additional seeders. Warnings may appear here, but can be ignored." 
npm run seed:service-types
echo "Database initialization complete!"