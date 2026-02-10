# Swagger Decorators Guide

This document explains the Swagger/OpenAPI decorators used in the Application Service API.

## Overview

Swagger decorators are used to generate interactive API documentation. They provide metadata about your endpoints, parameters, request bodies, and responses.

## Common Decorators

### @ApiTags()
**Purpose:** Groups related endpoints together in the Swagger UI  
**Location:** Controller class level  
**Example:**
```typescript
@ApiTags('forms')
@Controller('form')
export class FormController { }
```

### @ApiOperation()
**Purpose:** Provides a summary and description for an endpoint  
**Location:** Method level  
**Example:**
```typescript
@ApiOperation({ 
  summary: 'Create form submission',
  description: 'Submit a new form with data'
})
```

### @ApiParam()
**Purpose:** Documents path parameters (e.g., :id, :formId)  
**Location:** Method level  
**Example:**
```typescript
@ApiParam({ 
  name: 'formId', 
  description: 'The form identifier',
  example: 'business-permit-form'
})
```

### @ApiBody()
**Purpose:** Documents the request body structure  
**Location:** Method level  
**Example:**
```typescript
@ApiBody({ 
  description: 'Form submission data',
  schema: {
    type: 'object',
    properties: {
      data: {
        type: 'object',
        example: { firstName: 'John' }
      }
    }
  }
})
```

### @ApiResponse()
**Purpose:** Documents possible response codes and their structure  
**Location:** Method level  
**Example:**
```typescript
@ApiResponse({ 
  status: 200, 
  description: 'Form submission retrieved successfully',
  schema: {
    type: 'object',
    properties: {
      _id: { type: 'string' },
      data: { type: 'object' }
    }
  }
})
```

### @ApiBearerAuth()
**Purpose:** Indicates that an endpoint requires JWT authentication  
**Location:** Method or controller level  
**Example:**
```typescript
@ApiBearerAuth('JWT-auth')
@Get('protected')
```

## Configuration in main.ts

The Swagger configuration in `main.ts` sets up:

1. **DocumentBuilder** - Configures the API documentation metadata
   - Title, description, version
   - Tags for grouping endpoints
   - Authentication schemes

2. **SwaggerModule.createDocument()** - Generates the OpenAPI specification from your decorators

3. **SwaggerModule.setup()** - Mounts the Swagger UI at a specific path (e.g., `/api/docs`)

## Best Practices

1. **Always use @ApiTags()** - Groups endpoints logically in the UI
2. **Document all parameters** - Use @ApiParam() for path params, @ApiQuery() for query params
3. **Provide examples** - Include realistic examples in schemas
4. **Document all responses** - Include success and error responses
5. **Use descriptive summaries** - Make it clear what each endpoint does
6. **Keep descriptions concise** - Provide enough detail without overwhelming

## Accessing the Documentation

Once the application is running:
- **Swagger UI:** http://localhost:4006/api/docs
- **OpenAPI JSON:** http://localhost:4006/api/docs-json

## Testing with Swagger UI

1. Navigate to http://localhost:4006/api/docs
2. Click on any endpoint to expand it
3. Click "Try it out" button
4. Fill in parameters/body
5. Click "Execute" to test the endpoint
6. View the response below

## Authentication in Swagger

For protected endpoints:
1. Click the "Authorize" button (lock icon)
2. Enter your JWT token: `Bearer <your-token>`
3. Click "Authorize"
4. All subsequent requests will include the token

## Additional Resources

- [NestJS Swagger Documentation](https://docs.nestjs.com/openapi/introduction)
- [OpenAPI Specification](https://swagger.io/specification/)
- [Swagger UI Documentation](https://swagger.io/tools/swagger-ui/)
