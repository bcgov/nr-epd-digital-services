#!/bin/sh
if [ ! "$POSTGRESQL_HOST" ];
then
   echo 'Sourcing from .env'
   . ./.env
else
    echo 'Environment variables set...'
    mv .env env_bkup
fi

# create DB dependencies - database, schema
sh initDB.sh

# run type orm migrations 
npm run typeorm:run-migrations

# start the API 
npm start