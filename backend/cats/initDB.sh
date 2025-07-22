#!/bin/sh

#Make sure you change line endings to LF

if [ ! "$POSTGRESQL_HOST" ];
then
   echo 'Sourcing from .env'
   . ./.env
else
    echo 'Environment variables set...'
fi

# We need to quote it if it's like `cats-123`, the - causes issues.
QUOTED_POSTGRES_DATABASE="\"$POSTGRES_DATABASE\""
# log out host, port, dbname, etc
echo "POSTGRESQL_HOST: $POSTGRESQL_HOST"
echo "POSTGRES_DATABASE: $POSTGRES_DATABASE"
echo "QUOTED_POSTGRES_DATABASE: $QUOTED_POSTGRES_DATABASE"
echo "POSTGRES_DB_SCHEMA: $POSTGRES_DB_SCHEMA"
printf "-----\n\n"



echo "Creating database..."
psql "user=$POSTGRES_ADMIN_USERNAME password=$POSTGRES_ADMIN_PASSWORD host=$POSTGRESQL_HOST port=$POSTGRESQL_PORT" -c "CREATE DATABASE $QUOTED_POSTGRES_DATABASE OWNER $POSTGRES_ADMIN_USERNAME;"

echo "Creating extension..."
psql "user=$POSTGRES_ADMIN_USERNAME password=$POSTGRES_ADMIN_PASSWORD host=$POSTGRESQL_HOST port=$POSTGRESQL_PORT dbname=$POSTGRES_DATABASE" -c 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;' 

echo "Creating roles..."
psql "user=$POSTGRES_ADMIN_USERNAME password=$POSTGRES_ADMIN_PASSWORD host=$POSTGRESQL_HOST port=$POSTGRESQL_PORT dbname=$POSTGRES_DATABASE" -c "CREATE ROLE \"$POSTGRES_DB_USERNAME\" WITH LOGIN    NOSUPERUSER    NOCREATEDB    NOCREATEROLE    NOINHERIT    NOREPLICATION    CONNECTION LIMIT -1 PASSWORD '$POSTGRES_DB_PASSWORD';"

echo "Creating schema..."
psql "user=$POSTGRES_ADMIN_USERNAME password=$POSTGRES_ADMIN_PASSWORD host=$POSTGRESQL_HOST port=$POSTGRESQL_PORT dbname=$POSTGRES_DATABASE" -c "CREATE SCHEMA IF NOT EXISTS \"$POSTGRES_DB_SCHEMA\" AUTHORIZATION \"$POSTGRES_DB_USERNAME\";"

printf "\n\n-----\n\n"

echo "init db complete"

# run type orm migrations 
npm run typeorm:run-migrations

## TODO: Put seed data logic here.
# check if seed is enabled or not SEED_ENABLED should be true
if [ "$SEED_ENABLED" != "true" ]; then
    echo "Seed data is not enabled. Skipping seed data load."
else
    echo "SEED DATA PATH :: $SEED_DATA_PATH"
    # check if seed data path is set or not
    if [ -z "$SEED_DATA_PATH" ]; then
        echo "SEED_DATA_PATH is not set. Skipping seed data load."
    else
        # check if sites table has any rows
        if [ "$(PGPASSWORD="$POSTGRES_ADMIN_PASSWORD" psql -h "$POSTGRESQL_HOST" -d "$POSTGRES_DATABASE" -U "$POSTGRES_ADMIN_USERNAME" -t -c "SELECT count(*) FROM sites.sites;")" -gt 0 ]; then
            echo "Seed data already loaded. Skipping seed data load."
        else
            echo "Seed data set, seed is enabled, and db is blank, disabling constraints."
            # Disable constraints before seeding, if file exists
            if [ -f "/mnt/sql/disable_constraints.sql" ]; then
                echo "Disabling constraints..."
                PGPASSWORD="$POSTGRES_ADMIN_PASSWORD" psql -h "$POSTGRESQL_HOST" -d "$POSTGRES_DATABASE" -U "$POSTGRES_ADMIN_USERNAME" -f "/mnt/sql/disable_constraints.sql"
            fi

            echo "Seed data set, attempting to load."
            PGPASSWORD="$POSTGRES_ADMIN_PASSWORD" psql -q -h "$POSTGRESQL_HOST" -d "$POSTGRES_DATABASE" -U "$POSTGRES_ADMIN_USERNAME" -f "$SEED_DATA_PATH" > /dev/null
            echo "Seed data successfully loaded."

            # Enable constraints after seeding, if file exists
            if [ -f "/mnt/sql/enable_constraints.sql" ]; then
                echo "Enabling constraints..."
                PGPASSWORD="$POSTGRES_ADMIN_PASSWORD" psql -h "$POSTGRESQL_HOST" -d "$POSTGRES_DATABASE" -U "$POSTGRES_ADMIN_USERNAME" -f "/mnt/sql/enable_constraints.sql"
            fi
        fi
    fi
fi

npm run seed:service-types

echo "migrations completed"

exit 0