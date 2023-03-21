# create DB dependencies - database, schema
sh initDB.sh

# run type orm migrations 
npm run typeorm:run-migrations

# Creates a "dist" folder with the production build
npm run build

# start the API 
npm run start