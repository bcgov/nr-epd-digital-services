# Forms Flow Nav (Micro-Frontend)

## TLDR
```bash
docker-compose -f docker-compose-local.yml up --build
```

## Local Development

To run the application locally with hot-reloading enabled, follow these steps. This setup uses a custom Docker configuration that overlays your local source code onto the base image while preserving the required repository dependencies.

### Prerequisites

1.  **Docker & Docker Compose**: Ensure you have Docker or equivalent installed.

### Configuration

1.  Create a `.env` file in this directory (if not already present).
2.  Ensure any required environment variables (like `EPD_IDP_LOGOUT_URL`) are set if needed, though defaults may work for basic startup.

### Running the Application

Start the application using the local compose file:

```bash
docker-compose -f docker-compose-local.yml up --build
```

The application will be available at `http://localhost:3005`.

### Features

*   **Hot Reloading**: The application runs with a file watcher (`nodemon` + `rsync`) and Webpack Dev Server. Any changes you make to files in the local directory will be:
    1.  Automatically synced to the container.
    2.  Merged with the base application code (overlaying the base repo files).
    3.  Trigger a hot reload in the browser via Webpack.
*   **Repo Integration**: The build process automatically handles cloning the base `forms-flow-ai-micro-front-ends` repository and merging it with your local changes, ensuring you have the full application context.
