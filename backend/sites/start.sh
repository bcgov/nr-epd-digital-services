# create DB dependencies - database, schema
#sh initDB.sh

# run type orm migrations 
#npm run typeorm:run-migrations

# Creates a "dist" folder with the production build
#npm run build

#!/bin/sh

# Check if .npm directory exists
if [ -d "/home/node/.npm" ]; then
  # Change ownership of .npm folder
  chown -R node:node /home/node/.npm
else
  echo "Directory '/home/node/.npm' not found. Skipping ownership change."
fi

# Start the API
npm run start:prod
