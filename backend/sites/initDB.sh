#!/bin/sh

#Make sure you change line endings to LF

if [ ! "$POSTGRESQL_HOST" ];
then
   echo 'Sourcing from .env'
   . ./.env
else
    echo 'Environment variables set...'
fi

# create database
psql "user=$POSTGRES_ADMIN_USERNAME password=$POSTGRES_ADMIN_PASSWORD host=$POSTGRESQL_HOST port=$POSTGRESQL_PORT" -c "CREATE DATABASE $POSTGRES_DATABASE OWNER $POSTGRES_ADMIN_USERNAME;"

# create extension
psql "user=$POSTGRES_ADMIN_USERNAME password=$POSTGRES_ADMIN_PASSWORD host=$POSTGRESQL_HOST port=$POSTGRESQL_PORT dbname=$POSTGRES_DATABASE" -c 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;' 

#create postgis extension
psql "user=$POSTGRES_ADMIN_USERNAME password=$POSTGRES_ADMIN_PASSWORD host=$POSTGRESQL_HOST port=$POSTGRESQL_PORT dbname=$POSTGRES_DATABASE" -c 'CREATE EXTENSION IF NOT EXISTS "postgis" WITH SCHEMA public;' 

echo 'pwd'
echo $POSTGRES_DB_PASSWORD;

# create schema user
psql "user=$POSTGRES_ADMIN_USERNAME password=$POSTGRES_ADMIN_PASSWORD host=$POSTGRESQL_HOST port=$POSTGRESQL_PORT dbname=$POSTGRES_DATABASE" -c "CREATE ROLE $POSTGRES_DB_USERNAME WITH LOGIN    NOSUPERUSER    NOCREATEDB    NOCREATEROLE    NOINHERIT    NOREPLICATION    CONNECTION LIMIT -1 PASSWORD '$POSTGRES_DB_PASSWORD';"

# create schema
psql "user=$POSTGRES_ADMIN_USERNAME password=$POSTGRES_ADMIN_PASSWORD host=$POSTGRESQL_HOST port=$POSTGRESQL_PORT dbname=$POSTGRES_DATABASE" -c "CREATE SCHEMA IF NOT EXISTS $POSTGRES_DB_SCHEMA AUTHORIZATION $POSTGRES_DB_USERNAME"

echo "init db complete"

# # Set NPM_CONFIG_CACHE environment variable
# export NPM_CONFIG_CACHE=/home/node/.npm

# # Ensure ownership of .npm folder
# mkdir -p /home/node/.npm \
#     && chown -R node:node /home/node/.npm

# # NPM Permission Fix
# mkdir -p /.npm
# chown -R  1015500000:0 /.npm

# run type orm migrations 
npm run typeorm:run-migrations

echo "migrations completed"

exit 0