#!/bin/bash

set -e  # Exit immediately if a command exits with a non-zero status

# Variables
TEMP_POD="temp-pod"
PVC_FILE="pvc.yaml"
POD_FILE="temp-pod.yaml"
NAMESPACE="e38158-dev"
SQL_FILE="cats-data-test.sql"

# Apply PVC
oc apply -f "$PVC_FILE"

# Deploy temporary pod
oc apply -f "$POD_FILE"

# Wait for pod to be ready
echo "Targetting namespace: $NAMESPACE"
echo "Waiting for pod to be ready..."
oc wait --for=condition=Ready pod/$TEMP_POD --timeout=60s

# Copy main SQL file
if [[ -f "$SQL_FILE" ]]; then
    echo "Starting upload of $SQL_FILE to $TEMP_POD:/mnt/sql/data_migration.sql"
    oc cp "$SQL_FILE" "$TEMP_POD:/mnt/sql/data_migration.sql"
    echo "Uploaded $SQL_FILE"
else
    echo "Error: $SQL_FILE not found!"
    exit 1
fi

# Cleanup pod
echo "Cleaning up..."
oc delete pod "$TEMP_POD" --wait=true

echo "Done! SQL files are now available."
