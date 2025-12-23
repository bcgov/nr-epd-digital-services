#!/bin/bash

# Get the absolute path of the script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Load .env file
if [ -f "$SCRIPT_DIR/.env" ]; then
  set -o allexport
  source "$SCRIPT_DIR/.env"
  set +o allexport
fi

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to start services
start_services() {
    # Check if paths are set
    if [ -z "$FORMS_SERVICE_PATH" ]; then
        echo -e "${RED}Error: FORMS_SERVICE_PATH is not set. Please add it to your .env file.${NC}"
        exit 1
    fi

    if [ -z "$API_SERVICE_PATH" ]; then
        echo -e "${RED}Error: API_SERVICE_PATH is not set. Please add it to your .env file.${NC}"
        exit 1
    fi

    echo -e "${BLUE}=== Starting Forms Flow AI Platform ===${NC}"

    # 1. Start forms-flow-forms
    echo -e "${GREEN}Starting forms-flow-forms...${NC}"
    if [ -d "$FORMS_SERVICE_PATH" ]; then
        cd "$FORMS_SERVICE_PATH" || exit
        docker compose up -d --build
    else
        echo -e "${RED}Error: Directory $FORMS_SERVICE_PATH not found.${NC}"
        exit 1
    fi

    # 2. Start forms-flow-api
    echo -e "${GREEN}Starting forms-flow-api...${NC}"
    if [ -d "$API_SERVICE_PATH" ]; then
        cd "$API_SERVICE_PATH" || exit
        docker compose up -d --build
    else
        echo -e "${RED}Error: Directory $API_SERVICE_PATH not found.${NC}"
        exit 1
    fi

    # 3. Start local services
    # Navigate back to the directory where the script is located (repo root)
    cd "$SCRIPT_DIR" || exit

    echo -e "${GREEN}Starting local services (Documents, Nav, Theme, BPM)...${NC}"
    echo -e "${BLUE}Logs will stream below. Press Ctrl+C to stop the local services.${NC}"

    # Run in foreground to show logs
    docker-compose -f docker-compose-formsflow-local.yml up --build
}

# Function to stop services
stop_services() {
    echo -e "${BLUE}=== Stopping Forms Flow AI Platform ===${NC}"

    # 1. Stop local services
    echo -e "${GREEN}Stopping local services...${NC}"
    cd "$SCRIPT_DIR" || exit
    docker-compose -f docker-compose-formsflow-local.yml down

    # 2. Stop forms-flow-api
    echo -e "${GREEN}Stopping forms-flow-api...${NC}"
    if [ -d "$API_SERVICE_PATH" ]; then
        cd "$API_SERVICE_PATH" || exit
        docker compose down
    fi

    # 3. Stop forms-flow-forms
    echo -e "${GREEN}Stopping forms-flow-forms...${NC}"
    if [ -d "$FORMS_SERVICE_PATH" ]; then
        cd "$FORMS_SERVICE_PATH" || exit
        docker compose down
    fi

    echo -e "${BLUE}All services stopped.${NC}"
}

# Main logic
COMMAND=${1:-"--start"}

case "$COMMAND" in
    --start)
        start_services
        ;;
    --stop)
        stop_services
        ;;
    *)
        echo -e "${RED}Invalid argument: $COMMAND${NC}"
        echo "Usage: ./formsflow-dev.sh [--start | --stop]"
        exit 1
        ;;
esac
