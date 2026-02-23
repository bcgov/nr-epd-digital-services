# Quick Start Guide

## Start the Application

```bash
npm run start:dev
```

## Access Documentation

| Type | URL | Purpose |
|------|-----|---------|
| **REST API** | http://localhost:4005/api | Swagger UI for REST endpoints |
| **GraphQL API** | http://localhost:4005/graphql | GraphQL Playground for queries/mutations |

## Authentication

### Get Your JWT Token
1. Login to your Keycloak instance
2. Copy the JWT token from your session

### Use in Swagger (REST API)
1. Click **"Authorize"** button (top right)
2. Paste your token
3. Click **"Authorize"** then **"Close"**

### Use in GraphQL Playground
1. Click **"HTTP HEADERS"** (bottom left)
2. Add:
```json
{
  "Authorization": "Bearer YOUR_TOKEN_HERE"
}
```

## Quick Examples

### REST: Upload Files
```
POST /cats/uploadFiles
- files: [select files]
- bucketId: "invoice-attachments"
- invoiceId: 12345
```

### REST: Send Email
```
POST /cats/sendEmail
- file: [optional PDF]
- invoiceId: 12345
- to: ["email@example.com"]
- subject: "Invoice"
- body: "Your invoice"
```


### REST: Add User to Group
```
POST /users/addGroup
- userId: "123e4567-e89b-12d3-a456-426614174000"
```

### GraphQL: Get All Persons
```graphql
query {
  findAllPerson {
    data {
      id
      firstName
      lastName
      email
    }
  }
}
```

### GraphQL: Search Applications
```graphql
query {
  searchApplications(
    searchParam: ""
    page: 1
    pageSize: 10
    filter: ALL
  ) {
    count
    applications {
      id
      siteAddress
      status
    }
  }
}
```

### GraphQL: Create Invoice
```graphql
mutation {
  createInvoice(invoice: {
    personId: "123"
    subject: "Application Fee"
    issuedDate: "2024-01-15T00:00:00Z"
    dueDate: "2024-02-15T00:00:00Z"
    invoiceStatus: DRAFT
    taxExempt: false
    pstExempt: false
    subtotalInCents: 50000
    gstInCents: 2500
    pstInCents: 3500
    totalInCents: 56000
    applicationId: 456
    invoiceItems: [{
      description: "Review Fee"
      quantity: 1
      unitPriceInCents: 50000
      totalInCents: 50000
      itemType: "SERVICE"
    }]
  }) {
    message
    success
    data { id }
  }
}
```

## Need More Help?

- **REST API Documentation**: See `SWAGGER_DOCUMENTATION.md` for complete REST endpoint details
- **GraphQL Examples**: See `GRAPHQL_QUERIES_MUTATIONS.md` for all queries and mutations with examples

## Common Issues

### Swagger UI: "Authorize" button not working
- Make sure your JWT token is valid and not expired
- Token should NOT include the "Bearer " prefix when pasting
- Check Keycloak is running and accessible

### GraphQL Playground: Authentication errors
- Verify the Authorization header format: `"Authorization": "Bearer YOUR_TOKEN"`
- Make sure to include "Bearer " prefix in the header value
- Check the HTTP HEADERS panel is properly formatted JSON

### GraphQL Playground: Schema introspection failed
- Ensure the application is running: `npm run start:dev`
- Check `src/app.module.ts` has `playground: true` and `introspection: true`
- Verify no enum or type errors in your GraphQL schema

### Connection refused errors
- Confirm the app is running on port 4005
- Check no other service is using port 4005
- Verify your `.env` file has correct configuration
