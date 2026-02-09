import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

/**
 * Bootstrap function to initialize and start the NestJS application
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  /**
   * Swagger/OpenAPI Configuration
   * This sets up interactive API documentation accessible at /api/docs
   */
  const config = new DocumentBuilder()
    .setTitle('Application Service API')
    .setDescription('API documentation for the Application Service')
    .setVersion('1.0')
    // Add tags to group related endpoints together in the Swagger UI
    .addTag('applications', 'Application management endpoints')
    .addTag('forms', 'Form submission endpoints')
    // Configure JWT Bearer token authentication for protected endpoints
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth', // Reference name used in @ApiBearerAuth() decorators
    )
    .build();

  // Generate the OpenAPI specification document from the application
  const document = SwaggerModule.createDocument(app, config);

  // Setup Swagger UI at the /api/docs endpoint
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // Keep authorization token after page refresh
    },
  });

  // Start the application server on port 4006
  await app.listen(4006);
  console.log(`Application is running on: http://localhost:4006`);
  console.log(`Swagger documentation: http://localhost:4006/api/docs`);
}

// Start the application
bootstrap();
