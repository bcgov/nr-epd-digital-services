# Forms Flow Documents API

## TLDR
```bash
docker-compose -f docker-compose-local.yml up --build
```

## Local Development

To run the application locally with hot-reloading enabled, follow these steps. This setup uses a custom Docker configuration that overlays your local source code onto the base image while preserving the required private repository dependencies.

### Prerequisites

1.  **Docker & Docker Compose**: Ensure you have Docker or equivalent installed.
2.  **SSH Keys**: You need SSH keys authorized to access the private `forms-flow-ai-ee` repository (GitHub).

### Configuration

1.  Create a `.env` file in this directory (if not already present). You can copy `sample.env` as a starting point.
2.  Add your SSH keys to the `.env` file. These are required during the build process to clone the private repository.

    ```bash
    # .env content
    SSH_PRV_KEY="-----BEGIN OPENSSH PRIVATE KEY-----
    ...your private key content...
    -----END OPENSSH PRIVATE KEY-----"

    SSH_PUB_KEY="ssh-rsa ...your public key content..."
    ```

### Running the Application

Start the application using the local compose file:

```bash
docker-compose -f docker-compose-local.yml up --build
```

### Features

*   **Hot Reloading**: The application runs with a file watcher. Any changes you make to files in the `src/` directory will be:
    1.  Automatically synced to the container.
    2.  Merged with the base application code (overlaying the private repo files).
    3.  Trigger an automatic reload of the Gunicorn server.
*   **Private Repo Integration**: The build process automatically handles cloning the private `forms-flow-ai-ee` repository and merging it with your local changes, ensuring you have the full application context.
