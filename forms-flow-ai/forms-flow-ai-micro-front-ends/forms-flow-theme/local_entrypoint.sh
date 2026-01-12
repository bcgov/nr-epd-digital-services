#!/bin/bash

# Initial sync
echo "Performing initial sync..."
rsync -av /local_src/ /forms-flow-theme/app/ --exclude node_modules

# Start watcher
# Watch for changes in local_src and sync to app
# Exclude node_modules to avoid syncing it back and forth if it exists locally
echo "Starting nodemon watcher..."
nodemon -L --watch /local_src --delay 1 --ext js,jsx,scss,css,json --ignore node_modules --exec "rsync -av /local_src/ /forms-flow-theme/app/ --exclude node_modules" &

# Start dev server
echo "Starting webpack dev server..."
# Ensure we bind to 0.0.0.0 so it's accessible from outside the container
npm start -- --host 0.0.0.0 --port 3008
