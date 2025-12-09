import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Form } from '../entities/form.entity';

@Injectable()
export class FormService {
  constructor(
    @InjectRepository(Form) private readonly formRepository: Repository<Form>,
  ) {}

  /**
   * Checks if table exists
   * @returns boolean
   */
  async healthCheck(): Promise<any> {
    const tableExists = (
      await this.formRepository.manager.query(
        `SELECT exists (
      SELECT FROM information_schema.tables
        WHERE  table_schema = 'epd_applications'
        AND    table_name   = 'form'
        )`,
      )
    )[0].exists;
    return tableExists;
  }

  /**
   * Creates new form submission
   * @param formId formId
   * @param jsonData json form content
   * @returns saved form
   */
  async create(formId: string, jsonData: string): Promise<Form> {
    const entity = new Form();
    entity.formData = jsonData;
    entity.formId = formId;
    return await this.formRepository.save(entity);
  }

  /**
   * Finds a form submission
   * @param submissionId submissionId
   * @param formId formId
   * @returns form
   */
  async findOne(submissionId: string, formId: string): Promise<Form> {
    // First try to find with exact form_id match
    let submission = await this.formRepository.findOne({
      where: { formId: formId, id: submissionId },
    });
    
    // If not found, try to find by submission_id only (for bundle cases where individual form is being exported)
    if (!submission) {
      submission = await this.formRepository.findOne({
        where: { id: submissionId },
      });
    }
    
    return submission;
  }

  buildUpdateString = (pathText, newValue) => {
    const returnString =
      'jsonb_set("form_data"::jsonb,' + pathText + ',' + newValue + ')';
    return returnString;
  };

  processContent = async (
    partialUpdateObject,
    parentObjectNames,
    formId,
    submissionId,
  ) => {
    for (const property in partialUpdateObject) {
      if (typeof partialUpdateObject[property] === 'object') {
        this.processContent(
          partialUpdateObject[property],
          parentObjectNames == ''
            ? property
            : parentObjectNames + ',' + property,
          formId,
          submissionId,
        );
      } else if (typeof partialUpdateObject[property] !== 'object') {
        let objectName = parentObjectNames;
        if (objectName != '') {
          objectName += ',' + property;
        } else {
          objectName = property;
        }
        // no need to update data
        // we only want to update status while partial update
        if (objectName !== 'dataGrid') {
          const pathText = "'{" + objectName + "}'";

          const newValue = '\'"' + partialUpdateObject[property] + '"\'';

          await this.formRepository
            .createQueryBuilder()
            .update(Form)
            .set({
              formData: () => this.buildUpdateString(pathText, newValue),
            })
            .where('formId =  :formId and id = :submissionId', {
              formId: formId,
              submissionId: submissionId,
            })
            .execute();
        }
      }
    }
  };

  /**
   * updates form content
   * @param submissionId submission Id
   * @param formId form Id
   * @param formContent form Content
   * @returns updated form data
   */
  async partialUpdate(
    submissionId: string,
    formId: string,
    formContent: string,
  ): Promise<UpdateResult> {
    // const entity = await this.formRepository.findOne({
    //   where: { formId: formId, id: submissionId },
    // });

    const partialUpdateObject = formContent;

    this.processContent(partialUpdateObject, '', formId, submissionId);

    // const pathText = '{applicationId}';
    // const newValue = '"100"';

    //UPDATE epd_applications.form SET "form_data" =jsonb_set("form_data"::jsonb, '{data,applicationId}', '"205"') WHERE "id" = '955cc8e4-6fc2-4b36-bcf7-d86de57bb1f8'

    //UPDATE epd_applications.form SET "form_data" =jsonb_set("form_data"::jsonb, '{data,applicationId}', '"205"') WHERE "id" = '955cc8e4-6fc2-4b36-bcf7-d86de57bb1f8'

    //entity.formData = formContent;
    // const updateResult = await this.formRepository
    //   .createQueryBuilder()
    //   .update(Form)
    //   .set({
    //     formData: () =>
    //       'jsonb_set("form_data"::jsonb, \'{data,applicationId}\', \'"20005"\')',
    //   })
    //   .where('formId =  :formId and id = :submissionId', {
    //     formId: formId,
    //     submissionId: submissionId,
    //   })
    //   .execute();

    const updateResult: UpdateResult = {
      raw: [],
      generatedMaps: [],
      affected: 1,
    };
    return updateResult;
  }

  /**
   * updates form content
   * @param submissionId submission Id
   * @param formId form Id
   * @param formContent form Content
   * @returns updated form data
   */
  async update(
    submissionId: string,
    formId: string,
    formContent: string,
  ): Promise<UpdateResult> {
    const entity = await this.formRepository.findOne({
      where: { formId: formId, id: submissionId },
    });
    entity.formData = formContent;
    const updateResult = await this.formRepository.update(entity.id, entity);
    return updateResult;
  }
}
