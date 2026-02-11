#!/bin/bash
set -euo pipefail

# Initial sync
echo "Performing initial sync..."
rsync -av /local_src/ /forms-flow-web/app/ --exclude node_modules

# Start watcher
echo "Starting nodemon watcher..."
nodemon -L --watch /local_src --delay 1 --ext js,jsx,json,scss,css,html --ignore node_modules \
  --exec "rsync -av /local_src/ /forms-flow-web/app/ --exclude node_modules" &

export HOST=${HOST:-0.0.0.0}
export PORT=${PORT:-3002}

echo "Starting craco dev server on ${HOST}:${PORT}..."
exec npm start
