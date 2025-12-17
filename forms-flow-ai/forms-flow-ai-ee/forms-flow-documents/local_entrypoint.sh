#!/bin/bash

# Initial sync to ensure everything is up to date
echo "Performing initial sync..."
rsync -av /local_src/ /forms-flow-documents/app/src/

# Start the watcher in background
# -L: legacy watch (polling) which is required for Docker volumes
# --delay .5: wait .5s after change before running (debounce)
# --ext: watch specific extensions
echo "Starting nodemon watcher..."
nodemon -L --watch /local_src --delay .5 --ext py,js,html,css --exec "rsync -av /local_src/ /forms-flow-documents/app/src/" &

# Start gunicorn with reload
# The --reload flag enables auto-reloading on code changes
echo "Starting gunicorn..."
exec gunicorn -b :5006 'formsflow_documents:create_app()' --timeout 120 --worker-class=gthread --workers=5 --threads=10 --reload
