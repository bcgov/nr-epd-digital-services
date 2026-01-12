#!/bin/bash
set -euo pipefail

APP_DIR=/forms-flow-web-root-config/app
TEMPLATE="$APP_DIR/public/config/config.template.js"
TARGET="$APP_DIR/public/config/config.js"

render_config() {
  if [ -f "$TEMPLATE" ]; then
    mkdir -p "$(dirname "$TARGET")"
    envsubst < "$TEMPLATE" > "$TARGET"
    echo "Rendered config: $TARGET"
  else
    echo "WARN: config template not found at $TEMPLATE"
  fi
}

echo "Performing initial sync..."
rsync -av /local_src/ "$APP_DIR/" --exclude node_modules

echo "Generating config.js from config.template.js..."
render_config

echo "Starting nodemon watcher..."
# Sync any local changes into the working tree and re-render config.js
nodemon -L --watch /local_src --delay 1 --ext js,jsx,ts,tsx,json,scss,css,html,ejs \
  --ignore node_modules \
  --exec "/bin/sh -c 'rsync -av /local_src/ $APP_DIR/ --exclude node_modules && envsubst < $TEMPLATE > $TARGET'" &

echo "Starting root-config dev server..."
exec npm start -- --host 0.0.0.0
