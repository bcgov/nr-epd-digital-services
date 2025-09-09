import { Body, Controller, Get, Param, Patch, Post, Put, Req } from '@nestjs/common';
import { Unprotected } from 'nest-keycloak-connect';
import { SubmissionResponse } from '../dto/submissionResponse.dto';
import { Form } from '../entities/form.entity';
import { FormService } from '../services/form.service';
import { CatsService } from '../services/cats.service';

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
  @Get(':formId/submission/:submissionId') async getSubmission(
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
  @Post(':formId/submission') async save(
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
  @Put(':formId/submission/:submissionId') async updateSubmission(
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
  @Patch(':formId/submission/:submissionId') async partialUpdateSubmission(
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
