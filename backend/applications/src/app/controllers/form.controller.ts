import { Body, Controller, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { Resource, Unprotected } from 'nest-keycloak-connect';
import { SubmissionResponse } from '../dto/submissionResponse.dto';
import { Form } from '../entities/form.entity';
import { FormService } from '../services/form.service';

@Controller('form')
//@Resource('application-service')
@Unprotected()
export class FormController {
  constructor(private formService: FormService) {}

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
    @Body() content,
  ): Promise<SubmissionResponse> {
    const savedSubmission = await this.formService.create(formId, content.data);
    const submissionResponse: SubmissionResponse =
      this.transformResult(savedSubmission);
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
    @Body() content,
  ): Promise<any> {
    return await this.formService.update(submissionId, formId, content.data);
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
    @Body() content,
  ) {
    //const toUpdateContent = JSON.parse(content.data);
    //let i=0;
    return await this.formService.partialUpdate(
      submissionId,
      formId,
      content.data,
    );
  }
}
