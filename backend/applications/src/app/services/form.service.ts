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
    return this.formRepository.findOne({
      where: { formId: formId, id: submissionId },
    });
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
