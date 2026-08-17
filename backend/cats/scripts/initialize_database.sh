#! /bin/sh

set -eu

echo "Initializing database..."

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
if [ -z "${POSTGRES_DATABASE:-}" ]; then
    echo "POSTGRES_DATABASE is not set. Exiting..."
    exit 1
fi
if [ -z "${POSTGRES_DB_SCHEMA:-}" ]; then
    echo "POSTGRES_DB_SCHEMA is not set. Exiting..."
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
if [ -z "${POSTGRES_ADMIN_USERNAME:-}" ]; then
    echo "POSTGRES_ADMIN_USERNAME is not set. Exiting..."
    exit 1
fi
if [ -z "${POSTGRES_ADMIN_PASSWORD:-}" ]; then
    echo "POSTGRES_ADMIN_PASSWORD is not set. Exiting..."
    exit 1
fi
if [ -z "${SEED_DATA_PATH:-}" ]; then
    echo "SEED_DATA_PATH is not set. Exiting..."
    exit 1
fi
echo "Environment loaded successfully."

# Check that the necessary files exists.
if [ ! -f "${SEED_DATA_PATH}/data_migration.sql" ]; then
    echo "Data migration file not found. Exiting..."
    exit 1
fi
if [ ! -f "${SEED_DATA_PATH}/disable_constraints.sql" ]; then
    echo "Constraint disabling sql file not found. Exiting..."
    exit 1
fi
if [ ! -f "${SEED_DATA_PATH}/enable_constraints.sql" ]; then
    echo "Constraint enabling sql file not found. Exiting..."
    exit 1
fi
echo "Seed data files found successfully."

db_connection_string="host=${POSTGRES_HOST} port=${POSTGRES_PORT} dbname=${POSTGRES_DATABASE} user=${POSTGRES_ADMIN_USERNAME}"

# Check if the database is up and running. If the database is not ready this
# command will fail, and the script will exit.
echo "Checking if the database is up and running..."
PGPASSWORD="${POSTGRES_ADMIN_PASSWORD}" psql \
    -v ON_ERROR_STOP=1 \
    "${db_connection_string}" \
    -c '\q'
echo "Database is up and running. Proceeding with initialization..."

echo "Creating database schema..."
PGPASSWORD="${POSTGRES_ADMIN_PASSWORD}" psql \
    -v ON_ERROR_STOP=1 \
    "${db_connection_string}" \
    -c "CREATE SCHEMA IF NOT EXISTS \"$POSTGRES_DB_SCHEMA\" AUTHORIZATION \"$POSTGRES_DB_USERNAME\""
echo "Schema created successfully."

echo "Running database migrations..."
npm run typeorm:run-migrations
echo "Database migrations completed successfully."

# Failsafe check to ensure that the database is, in fact, empty before trying to
# load data. With the constraints disabled, loading this onto an existing
# database would cause catastrophy.
existing_rows=$(PGPASSWORD="${POSTGRES_ADMIN_PASSWORD}" psql -v ON_ERROR_STOP=1 "${db_connection_string}" -tAc "SELECT count(*) FROM \"$POSTGRES_DB_SCHEMA\".application")

if [ "${existing_rows}" -eq 0 ]; then

    echo "Loading seed data into database..."

    echo "Disabling constraints..."
    PGPASSWORD="${POSTGRES_ADMIN_PASSWORD}" psql \
        -v ON_ERROR_STOP=1 \
        "${db_connection_string}" \
        -f "${SEED_DATA_PATH}/disable_constraints.sql"
    echo "Constraints disabled."

    echo "Loading seed data (this might take a while)..."
    PGPASSWORD="${POSTGRES_ADMIN_PASSWORD}" psql \
        -v ON_ERROR_STOP=1 \
        "${db_connection_string}" \
        -f "${SEED_DATA_PATH}/data_migration.sql"
    echo "Seed data loaded successfully."

    echo "Re-enabling constraints..."
    PGPASSWORD="${POSTGRES_ADMIN_PASSWORD}" psql \
        -v ON_ERROR_STOP=1 \
        "${db_connection_string}" \
        -f "${SEED_DATA_PATH}/enable_constraints.sql"
    echo "Constraints re-enabled."

    echo "Database seeded successfully."
else
    echo "Database already contains data. Skipping seed data load."
fi

echo "Running additional seeders. Warnings may appear here, but can be ignored." 
npm run seed:service-types
echo "Database initialization complete!"