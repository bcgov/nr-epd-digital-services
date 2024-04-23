# create DB dependencies - database, schema
#sh initDB.sh

# run type orm migrations 
#npm run typeorm:run-migrations

# Creates a "dist" folder with the production build
#npm run build

#!/bin/sh

# Set npm cache directory
export NPM_CONFIG_CACHE=/home/node/.npm

# Ensure ownership of .npm folder
mkdir -p /home/node/.npm
chown -R node:node /home/node/.npm

# Start the API
npm run start:prod
