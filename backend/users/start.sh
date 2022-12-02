# create DB dependencies - database, schema
sh initDB.sh

# run type orm migrations 
npm run typeorm:run-migrations

# run the prebuild
npm run build

# start the API 
npm run start:prod