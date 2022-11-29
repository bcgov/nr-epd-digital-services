# create DB dependencies - database, schema
sh initDB.sh

# run type orm migrations 
npm run typeorm:run-migrations

# run the prebuild
npm run prebuild

# start the API 
npm start