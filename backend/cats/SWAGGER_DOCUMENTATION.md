# Cats Service API Documentation

This document provides information about accessing and using the Swagger/OpenAPI documentation for the Cats Service REST API.

## Accessing the Documentation

Once the application is running, you can access the interactive Swagger UI documentation at:

```
http://localhost:4005/api
```

## Available Endpoints

### User Management (`/users`)

#### POST /users/addGroup
- **Description**: Add user to formsflow-client group in Keycloak
- **Authentication**: Requires JWT Bearer token with `user-admin` role
- **Request Body**:
  ```json
  {
    "userId": "123e4567-e89b-12d3-a456-426614174000"
  }
  ```

#### POST /users/addUserToGroupForMuncipalUsers
- **Description**: Add user to LRS approving authority group and remove from camunda-admin
- **Authentication**: Requires JWT Bearer token with `user-admin` role
- **Request Body**:
  ```json
  {
    "userId": "123e4567-e89b-12d3-a456-426614174000"
  }
  ```

#### POST /users/addUserToGroupForSiteOwners
- **Description**: Add user to site owners group and remove from camunda-admin
- **Authentication**: Requires JWT Bearer token with `user-admin` role
- **Request Body**:
  ```json
  {
    "userId": "123e4567-e89b-12d3-a456-426614174000"
  }
  ```

### Cats Service (`/cats`)

#### POST /cats/sendEmail
- **Description**: Send invoice email with optional PDF attachment
- **Authentication**: Requires JWT Bearer token
- **Content-Type**: `multipart/form-data`
- **Request Body**:
  - `file` (optional): PDF file attachment
  - `invoiceId` (required): Invoice ID number
  - `to` (required): Array of recipient email addresses
  - `subject` (required): Email subject
  - `body` (required): Email body content

#### POST /cats/uploadFiles
- **Description**: Upload multiple files (up to 20) to COMS and associate with an invoice
- **Authentication**: Requires JWT Bearer token
- **Content-Type**: `multipart/form-data`
- **Request Body**:
  - `files` (required): Array of files to upload (max 20)
  - `bucketId` (required): COMS bucket ID
  - `invoiceId` (required): Invoice ID number
- **Response Codes**:
  - `200`: All files uploaded successfully
  - `207`: Multi-Status - Some files succeeded, some failed/conflicted
  - `400`: Bad request - No files provided
  - `409`: Conflict - All files already exist
  - `500`: Internal server error

## Authentication

All endpoints require JWT Bearer token authentication. To use the API:

1. Click the "Authorize" button in the Swagger UI
2. Enter your JWT token in the format: `Bearer <your-token>`
3. Click "Authorize" to apply the token to all requests

## Starting the Application

To start the application and access the Swagger documentation:

```bash
npm run start:dev
```

The application will start on port 4005, and you'll see:
```
Application is running on: http://localhost:4005
Swagger documentation available at: http://localhost:4005/api
```

## Features

- **Interactive API Testing**: Test all endpoints directly from the browser
- **Request/Response Examples**: See example payloads and responses
- **Schema Validation**: View required fields and data types
- **Authentication Support**: Built-in JWT token management
- **File Upload Support**: Test file upload endpoints with actual files
