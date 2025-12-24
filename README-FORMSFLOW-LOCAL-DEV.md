# Formsflow Local Development Setup

This configuration allows you to run multiple Formsflow services locally with hot-reloading enabled for most services, all from a single entry point.

# NOTE

`forms-flow-web` and `forms-flow-web-root-config` are not included in this centralized startup routine, this will come in a future update.

For now, start (and reload) these servies like you did before with `docker compose up --build`

## Prerequisites

1.  **Docker & Docker Compose**: Ensure you have Docker installed.
2.  **SSH Keys**: Required for to clone the private repository.
3.  **DNS Setup**: Add the following line to your `/etc/hosts` file to ensure `host.docker.internal` resolves correctly in your browser:
    ```
    127.0.0.1 host.docker.internal
    # This removes the need to hardcode your local IP address and change it every time you switch networks
    ```

## Configuration

1.  Create a `.env` file in the root directory (`nr-epd-digital-services`).
2.  Add the required environment variables. **Use `.env.sample` as a reference**

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

## How it Works

This centralized compose file references the `local.Dockerfile` in each service's directory. It mounts the source code from your local workspace into the containers, enabling the hot-reloading mechanisms (watchdog/nodemon) defined in local setup of most services. 

External services (`forms-flow-forms` and `forms-flow-api`) and `forms-flow-bpm` do not support hot-reloading (but we can add it to BPM if we ever need it)