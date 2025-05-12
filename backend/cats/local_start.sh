#Make sure you change line endings to LF

npm ci
# create DB dependencies - database, schema
sh initDB.sh

# run type orm migrations 
npm run typeorm:run-migrations

npm run seed:service-types

# Creates a "dist" folder with the production build
# npm run build

# start the API 
npm run start:dev