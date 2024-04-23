# create DB dependencies - database, schema
#sh initDB.sh

# run type orm migrations 
#npm run typeorm:run-migrations

# Creates a "dist" folder with the production build
#npm run build

# Change ownership of .npm folder
chown -R node:node /home/node/.npm

# start the API 
npm run start:prod