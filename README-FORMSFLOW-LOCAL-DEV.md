# Formsflow Local Development Setup

This configuration allows you to run multiple Formsflow services locally with hot-reloading enabled for most services, all from a single entry point.

## Prerequisites

1.  **Docker & Docker Compose**: Ensure you have Docker installed.
2.  **SSH Keys**: Required for to clone the private repository.

## Configuration

1.  Create a `.env` file in the root directory (`nr-epd-digital-services`).
2.  Add the required environment variables. You can combine the requirements from the individual services.

    ```bash
    # .env content

    # SSH Keys (Required for forms-flow-documents)
    SSH_PRV_KEY="-----BEGIN OPENSSH PRIVATE KEY-----
    ...your private key content...
    -----END OPENSSH PRIVATE KEY-----"
    SSH_PUB_KEY="ssh-rsa ...your public key content..."

    # Keycloak / Auth (Adjust as needed for your local setup)
    KEYCLOAK_URL=http://host.docker.internal:8080
    KEYCLOAK_URL_REALM=forms-flow-ai
    KEYCLOAK_WEB_CLIENT_ID=forms-flow-web

    # Forms Flow API URLs
    FORMSFLOW_API_URL=http://host.docker.internal:5000
    FORMSFLOW_DOC_API_URL=http://host.docker.internal:5006
    
    # Micro-Frontends
    EPD_IDP_LOGOUT_URL=http://localhost:3000/logout

    # External Service Paths (Required for formsflow-dev.sh)
    FORMS_SERVICE_PATH="/path/to/forms-flow-ai-ee/forms-flow-forms"
    API_SERVICE_PATH="/path/to/forms-flow-ai-ee/forms-flow-api"
    ```

## Running the Platform

There is a helper script `formsflow-dev.sh` to manage startup of the entire platform, including external services (`forms-flow-forms` and `forms-flow-api`).

### Start Everything
This script starts the external services in the background and then starts the local services in the foreground (streaming logs).

```bash
./formsflow-dev.sh
# OR explicitly
./formsflow-dev.sh --start
```

### Stop Everything
This script stops all services (local and external).

```bash
./formsflow-dev.sh --stop
```

## Running Local Services Only

If you only want to run the services in this repository:

```bash
docker-compose -f docker-compose-formsflow-local.yml up --build
```

To start a specific service (e.g., just the nav):

```bash
docker-compose -f docker-compose-formsflow-local.yml up --build forms-flow-nav
```

## Service Access

*   **Forms Flow Documents**: `http://localhost:5006`
*   **Forms Flow Nav**: `http://localhost:3005`
*   **Forms Flow Theme**: `http://localhost:3008`
*   **Forms Flow BPM**: `http://localhost:8000`

## How it Works

This centralized compose file references the `local.Dockerfile` in each service's directory. It mounts the source code from your local workspace into the containers, enabling the hot-reloading mechanisms (watchdog/nodemon) defined in each service's local setup.
