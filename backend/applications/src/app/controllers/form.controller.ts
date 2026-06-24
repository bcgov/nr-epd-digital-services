import { Body, Controller, Get, Param, Patch, Post, Put, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiBody } from '@nestjs/swagger';
import { Unprotected } from 'nest-keycloak-connect';
import { SubmissionResponse } from '../dto/submissionResponse.dto';
import { Form } from '../entities/form.entity';
import { FormService } from '../services/form.service';
import { CatsService } from '../services/cats.service';
import { IntakeService } from '../services/intake.service';

/**
 * Form Controller
 * Handles all form submission related operations including create, read, update
 * 
 * @ApiTags - Groups all form endpoints under 'forms' tag in Swagger UI
 * @Controller - Defines the base route as '/form'
 * @Unprotected - Disables Keycloak authentication for all endpoints in this controller
 */
@ApiTags('forms')
@Controller('form')
//@Resource('application-service')
@Unprotected()
export class FormController {
  constructor(
    private formService: FormService,
    private catsService: CatsService,
    private intakeService: IntakeService,
  ) { }

  /**
   * Health check endpoint
   * Verifies that the form table exists in the database
   * 
   * @returns {Promise<number>} Count of forms in the database
   * @throws {404} If the form table doesn't exist
   * 
   * @ApiOperation - Documents the endpoint purpose in Swagger
   * @ApiResponse - Documents possible response codes and their meanings
   */
  @Get('health')
  @ApiOperation({
    summary: 'Health check endpoint',
    description: 'Checks if the form table exists and returns the count of forms'
  })
  @ApiResponse({
    status: 200,
    description: 'Health check successful',
    schema: {
      type: 'number',
      example: 42
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Table not found'
  })
  async healthCheck(): Promise<number> {
    const formCount = await this.formService.healthCheck();

    if (!formCount) {
      return Promise.reject({
        statusCode: 404,
        message: 'Table not found',
      });
    }
    return formCount;
  }

  /**
   * Get a specific form submission
   * Retrieves a saved form submission by its form ID and submission ID
   * 
   * @param {string} formId - The unique identifier of the form
   * @param {string} submissionId - The unique identifier of the submission
   * @returns {Promise<SubmissionResponse>} The form submission data
   * @throws {404} If the form submission is not found
   * 
   * @ApiOperation - Documents the endpoint in Swagger
   * @ApiParam - Documents the path parameters
   * @ApiResponse - Documents response structure and status codes
   */
  @Get(':formId/submission/:submissionId')
  @ApiOperation({
    summary: 'Get form submission',
    description: 'Retrieve a specific form submission by form ID and submission ID'
  })
  @ApiParam({
    name: 'formId',
    description: 'The form identifier',
    example: 'business-permit-form'
  })
  @ApiParam({
    name: 'submissionId',
    description: 'The submission identifier',
    example: '507f1f77bcf86cd799439011'
  })
  @ApiResponse({
    status: 200,
    description: 'Form submission retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
        form: { type: 'string', example: 'business-permit-form' },
        data: { type: 'object', example: { firstName: 'John', lastName: 'Doe' } },
        created: { type: 'string', format: 'date-time' },
        modified: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Form data not found'
  })
  async getSubmission(
    @Param('formId') formId,
    @Param('submissionId') submissionId,
  ): Promise<SubmissionResponse> {
    const savedSubmission = await this.formService.findOne(
      submissionId,
      formId,
    );

    if (!savedSubmission) {
      return Promise.reject({
        statusCode: 404,
        message: 'Form data not found',
      });
    }

    const submissionResponse: SubmissionResponse =
      this.transformResult(savedSubmission);
    return submissionResponse;
  }

  /**
   * Create a new form submission
   * Saves form data and optionally submits to CATS if integration is enabled
   * 
   * @param {string} formId - The unique identifier of the form
   * @param {any} content - The form submission data containing a 'data' property
   * @param {any} request - Express request object for accessing headers
   * @returns {Promise<SubmissionResponse>} The saved form submission
   * 
   * @ApiOperation - Documents the endpoint purpose
   * @ApiParam - Documents the formId path parameter
   * @ApiBody - Defines the expected request body structure with examples
   * @ApiResponse - Documents the successful response structure
   */
  @Post(':formId/submission')
  @ApiOperation({
    summary: 'Create form submission',
    description: 'Submit a new form with data'
  })
  @ApiParam({
    name: 'formId',
    description: 'The form identifier',
    example: 'business-permit-form'
  })
  @ApiBody({
    description: 'Form submission data',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          description: 'Form data in JSON format',
          example: {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com'
          }
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Form submission created successfully',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
        form: { type: 'string', example: 'business-permit-form' },
        data: { type: 'object', example: { firstName: 'John', lastName: 'Doe' } },
        created: { type: 'string', format: 'date-time' },
        modified: { type: 'string', format: 'date-time' }
      }
    }
  })
  async save(
    @Param('formId') formId,
    @Body() content,
  ): Promise<SubmissionResponse> {
    const result = await this.intakeService.submitToIntake(formId, content.data);
    return result.submission;
  }

  /**
   * Transform form entity to response format
   * Converts the database entity to the format expected by formsflow
   * 
   * @param {Form} savedSubmission - The form entity from the database
   * @returns {SubmissionResponse} Transformed response object
   * @private
   */
  transformResult(savedSubmission: Form) {
    return this.intakeService.transformResult(savedSubmission);
  }

  /**
   * Update an existing form submission (full update)
   * Replaces all form data with the new data provided
   * 
   * @param {string} formId - The unique identifier of the form
   * @param {string} submissionId - The unique identifier of the submission
   * @param {any} content - The updated form data
   * @param {any} request - Express request object
   * @returns {Promise<any>} The update result
   * 
   * @ApiOperation - Documents the endpoint purpose
   * @ApiParam - Documents the path parameters
   * @ApiBody - Defines the expected request body
   * @ApiResponse - Documents the response
   */
  @Put(':formId/submission/:submissionId')
  @ApiOperation({
    summary: 'Update form submission',
    description: 'Completely update an existing form submission'
  })
  @ApiParam({
    name: 'formId',
    description: 'The form identifier',
    example: 'business-permit-form'
  })
  @ApiParam({
    name: 'submissionId',
    description: 'The submission identifier',
    example: '507f1f77bcf86cd799439011'
  })
  @ApiBody({
    description: 'Updated form submission data',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          description: 'Form data in JSON format',
          example: {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com'
          }
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Form submission updated successfully'
  })
  async updateSubmission(
    @Param('formId') formId,
    @Param('submissionId') submissionId,
    @Body() content, @Req() request,
  ): Promise<any> {
    const updatedSubmission = await this.formService.update(submissionId, formId, content.data);
    return updatedSubmission;
  }

  /**
   * Partially update an existing form submission
   * Updates only the fields provided, leaving other fields unchanged
   * Also updates the CATS application if integration is enabled
   * 
   * @param {string} formId - The unique identifier of the form
   * @param {string} submissionId - The unique identifier of the submission
   * @param {any} content - The partial form data to update
   * @param {any} request - Express request object
   * @returns {Promise<any>} The update result
   * 
   * @ApiOperation - Documents the endpoint purpose
   * @ApiParam - Documents the path parameters
   * @ApiBody - Defines the expected request body with partial data example
   * @ApiResponse - Documents the response
   */
  @Patch(':formId/submission/:submissionId')
  @ApiOperation({
    summary: 'Partially update form submission',
    description: 'Partially update an existing form submission'
  })
  @ApiParam({
    name: 'formId',
    description: 'The form identifier',
    example: 'business-permit-form'
  })
  @ApiParam({
    name: 'submissionId',
    description: 'The submission identifier',
    example: '507f1f77bcf86cd799439011'
  })
  @ApiBody({
    description: 'Partial form submission data',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          description: 'Form data in JSON format',
          example: {
            email: 'newemail@example.com'
          }
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Form submission partially updated successfully'
  })
  async partialUpdateSubmission(
    @Param('formId') formId,
    @Param('submissionId') submissionId,
    @Body() content, @Req() request,
  ) {
    // Perform partial update on the form submission
    const partialUpdatedSubmission = await this.formService.partialUpdate(
      submissionId,
      formId,
      content.data,
    );

    // If CATS integration is enabled, update the CATS application as well
    if (process.env.CATS_INTEGRATION_ENABLED === 'true') {
      await this.catsService.updateCatsApplication(submissionId, formId, content.data);
    }

    return partialUpdatedSubmission;
  }
}
