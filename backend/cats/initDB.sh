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

npm run seed:service-types

echo "migrations completed"

exit 0