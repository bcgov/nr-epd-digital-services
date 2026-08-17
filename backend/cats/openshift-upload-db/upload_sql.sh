#!/bin/bash

set -e  # Exit immediately if a command exits with a non-zero status

# Variables
TEMP_POD="temp-pod"
PVC_FILE="pvc.yaml"
POD_FILE="temp-pod.yaml"
NAMESPACE="e38158-dev"
SQL_FILE="cats-prod-data-7Aug.sql"
APPEND_FILE="append.sql"
COMBINED_FILE="combined-data.sql"
ENABLE_CONSTRAINTS_FILE="enable_constraints.sql"
DISABLE_CONSTRAINTS_FILE="disable_constraints.sql"

# Apply PVC
oc apply -f "$PVC_FILE" -n "$NAMESPACE"

# Deploy temporary pod
oc apply -f "$POD_FILE" -n "$NAMESPACE"

# Wait for pod to be ready
echo "Targetting namespace: $NAMESPACE"
echo "Waiting for pod to be ready..."
oc wait --for=condition=Ready pod/$TEMP_POD -n "$NAMESPACE" --timeout=60s

# Create combined file
if [[ -f "$SQL_FILE" && -f "$ENABLE_CONSTRAINTS_FILE" && -f "$DISABLE_CONSTRAINTS_FILE" ]]; then
    if [[ -f "$APPEND_FILE" ]]; then
        cat "$SQL_FILE" "$APPEND_FILE" > "$COMBINED_FILE"
    else
        echo "Warning: $APPEND_FILE not found. Using only $SQL_FILE."
        cp "$SQL_FILE" "$COMBINED_FILE"
    fi
    echo "Starting upload of $COMBINED_FILE to $TEMP_POD:/mnt/sql/data_migration.sql"
    oc cp "$COMBINED_FILE" "$TEMP_POD:/mnt/sql/data_migration.sql" -n "$NAMESPACE"
    echo "Uploaded $COMBINED_FILE"
    rm "$COMBINED_FILE"

    echo "Starting upload of $ENABLE_CONSTRAINTS_FILE to $TEMP_POD:/mnt/sql/enable_constraints.sql"
    oc cp "$ENABLE_CONSTRAINTS_FILE" "$TEMP_POD:/mnt/sql/enable_constraints.sql" -n "$NAMESPACE"
    echo "Uploaded $ENABLE_CONSTRAINTS_FILE"

    echo "Starting upload of $DISABLE_CONSTRAINTS_FILE to $TEMP_POD:/mnt/sql/disable_constraints.sql"
    oc cp "$DISABLE_CONSTRAINTS_FILE" "$TEMP_POD:/mnt/sql/disable_constraints.sql" -n "$NAMESPACE"
    echo "Uploaded $DISABLE_CONSTRAINTS_FILE"

    echo "All files uploaded successfully."
else
    echo "Error: Required SQL files are missing. Ensure $SQL_FILE, $ENABLE_CONSTRAINTS_FILE, and $DISABLE_CONSTRAINTS_FILE exist."
    exit 1
fi


# Cleanup pod
echo "Cleaning up..."
oc delete pod "$TEMP_POD" -n "$NAMESPACE" --wait=true

echo "Done! SQL files are now available."
