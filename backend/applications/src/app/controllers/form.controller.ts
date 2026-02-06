import { Body, Controller, Get, Param, Patch, Post, Put, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiBody } from '@nestjs/swagger';
import { Unprotected } from 'nest-keycloak-connect';
import { SubmissionResponse } from '../dto/submissionResponse.dto';
import { Form } from '../entities/form.entity';
import { FormService } from '../services/form.service';
import { CatsService } from '../services/cats.service';

@ApiTags('forms')
@Controller('form')
//@Resource('application-service')
@Unprotected()
export class FormController {
  constructor(
    private formService: FormService,
    private catsService: CatsService
  ) { }

  /**
   * Checks if table exists
   * @returns boolean
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
   * Get a submitted form using
   * @param formId formId
   * @param submissionId submissionId
   * @returns saved form submission
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
   * Creates a new form submission
   * @param formId formId
   * @param content formContent in JSON format
   * @returns saved form submission
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
    @Body() content, @Req() request,
  ): Promise<SubmissionResponse> {
    const origin = request.headers.origin;
    const savedSubmission = await this.formService.create(formId, content.data);
    const submissionResponse: SubmissionResponse =
      this.transformResult(savedSubmission);
    if (origin && process.env.CATS_INTEGRATION_ENABLED === 'true')
      await this.catsService.submitToCats(content.data, savedSubmission.id, savedSubmission.formId);
    return submissionResponse;
  }

  /**
   * Transforming the form entity into formsflow expected response
   * @param savedSubmission saved form
   * @returns saved form in formflow expected format
   */
  transformResult(savedSubmission: Form) {
    const submissionResponse: SubmissionResponse = new SubmissionResponse();
    submissionResponse._id = savedSubmission.id;
    submissionResponse.form = savedSubmission.formId;
    submissionResponse.data = savedSubmission.formData;
    submissionResponse.created = savedSubmission.createdDate;
    submissionResponse.modified = savedSubmission.modifiedDate;
    return submissionResponse;
  }

  /**
   * Updates the form submission
   * @param formId formId
   * @param submissionId submissionId
   * @param content content
   * @returns update result
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
   * Partially updates the form submission
   * @param formId formId
   * @param submissionId submissionId
   * @param content content
   * @returns update result
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
    const partialUpdatedSubmission = await this.formService.partialUpdate(
      submissionId,
      formId,
      content.data,
    );

    if (process.env.CATS_INTEGRATION_ENABLED === 'true') {
      await this.catsService.updateCatsApplication(submissionId, formId, content.data);
    }
    return partialUpdatedSubmission;
  }
}
