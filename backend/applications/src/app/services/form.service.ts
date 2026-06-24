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
  async findByChefsSubmissionId(chefsSubmissionId: string): Promise<Form | null> {
    const rows = await this.formRepository
      .createQueryBuilder('form')
      .where(`form.form_data->'_intake'->>'chefsSubmissionId' = :id`, {
        id: chefsSubmissionId,
      })
      .getMany();

    return rows[0] ?? null;
  }

  /**
   * Finds a CATS application already linked to this adapter mirror (form_id + submission_id on app_status).
   * Used when _intake.catsApplicationId was lost but CATS create succeeded earlier.
   */
  async findCatsApplicationIdByFormSubmission(
    formId: string,
    adapterSubmissionId: string,
  ): Promise<number | null> {
    try {
      const rows = await this.formRepository.manager.query(
        `SELECT application_id AS "applicationId"
         FROM cats.app_status
         WHERE form_id = $1 AND submission_id = $2
         ORDER BY id DESC
         LIMIT 1`,
        [formId, adapterSubmissionId],
      );
      const id = rows[0]?.applicationId;
      return id != null && !Number.isNaN(Number(id)) ? Number(id) : null;
    } catch {
      return null;
    }
  }

  /**
   * Current CATS status for an adapter mirror (used when syncing site IDs on re-ingest).
   */
  async findCatsApplicationCurrentStatus(
    formId: string,
    adapterSubmissionId: string,
  ): Promise<{ applicationId: number; statusTypeAbbrev: string } | null> {
    try {
      const rows = await this.formRepository.manager.query(
        `SELECT a.application_id AS "applicationId", st.abbrev AS "statusTypeAbbrev"
         FROM cats.app_status a
         JOIN cats.status_type st ON st.id = a.status_type_id
         WHERE a.form_id = $1 AND a.submission_id = $2 AND a.is_current = true
         ORDER BY a.id DESC
         LIMIT 1`,
        [formId, adapterSubmissionId],
      );
      const row = rows[0];
      if (!row?.applicationId) {
        return null;
      }
      return {
        applicationId: Number(row.applicationId),
        statusTypeAbbrev: String(row.statusTypeAbbrev),
      };
    } catch {
      return null;
    }
  }

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
