import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { ApplicationSubmission } from '../../entities/applicationSubmission.entity';
import { LoggerService } from '../../logger/logger.service';
import {
  CreateApplicationSubmissionInput,
  UpdateApplicationSubmissionInput,
} from '../../dto/applicationSubmission.dto';
import { getFormConfigByAppType } from '../formIntake/formIntake.constants';

@Injectable()
export class ApplicationSubmissionService {
  constructor(
    @InjectRepository(ApplicationSubmission)
    private readonly submissionRepository: Repository<ApplicationSubmission>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly loggerService: LoggerService,
  ) {}

  async getSubmissionByApplicationId(applicationId: number) {
    try {
      this.loggerService.log(
        `Fetching submission for application ${applicationId}`,
      );
      if (applicationId <= 0) {
        this.loggerService.log(
          `Invalid applicationId ${applicationId}, returning null`,
        );
        return null;
      }
      const submission = await this.submissionRepository.findOne({
        where: { applicationId },
        relations: ['application', 'application.appType'],
      });
      return submission || null;
    } catch (error) {
      this.loggerService.error(
        `Failed to fetch submission for application ${applicationId}: ${error.message}`,
        null,
      );
      throw new Error(
        `Failed to fetch submission for application ID ${applicationId}: ${error.message}`,
      );
    }
  }

  async createSubmission(
    input: CreateApplicationSubmissionInput,
    user: string,
  ) {
    try {
      this.loggerService.log(
        `Creating submission for chefsSubmissionId ${input.chefsSubmissionId}`,
      );
      const now = new Date();
      const { formData, ...rest } = input;
      const submission = this.submissionRepository.create({
        ...rest,
        formData: JSON.parse(formData),
        createdBy: user,
        updatedBy: user,
        createdDateTime: now,
        updatedDateTime: now,
      });
      const saved = await this.submissionRepository.save(submission);
      this.loggerService.log(`Submission created with ID ${saved.id}`);
      return saved;
    } catch (error) {
      this.loggerService.error(
        `Failed to create submission: ${error.message}`,
        null,
      );
      throw new Error(`Failed to create submission: ${error.message}`);
    }
  }

  async updateSubmission(
    input: UpdateApplicationSubmissionInput,
    user: string,
  ) {
    try {
      this.loggerService.log(`Updating submission ${input.id}`);
      const existing = await this.submissionRepository.findOne({
        where: { id: input.id },
      });
      if (!existing) {
        throw new Error(`Submission with ID ${input.id} not found`);
      }
      const { formData, ...rest } = input;
      const updated = this.submissionRepository.merge(existing, {
        ...rest,
        ...(formData !== undefined && { formData: JSON.parse(formData) }),
        updatedBy: user,
        updatedDateTime: new Date(),
      });
      const saved = await this.submissionRepository.save(updated);
      this.loggerService.log(`Submission ${input.id} updated successfully`);
      return saved;
    } catch (error) {
      this.loggerService.error(
        `Failed to update submission ${input.id}: ${error.message}`,
        null,
      );
      throw new Error(
        `Failed to update submission with ID ${input.id}: ${error.message}`,
      );
    }
  }

  async upsertSubmissionByChefsSubmissionId(
    input: CreateApplicationSubmissionInput,
    user: string,
  ) {
    try {
      this.loggerService.log(
        `Upserting submission for chefsSubmissionId ${input.chefsSubmissionId}`,
      );
      const existing = await this.submissionRepository.findOne({
        where: { chefsSubmissionId: input.chefsSubmissionId },
      });
      if (existing) {
        const { formData, ...rest } = input;
        const updated = this.submissionRepository.merge(existing, {
          ...rest,
          formData: JSON.parse(formData),
          updatedBy: user,
          updatedDateTime: new Date(),
        });
        const saved = await this.submissionRepository.save(updated);
        this.loggerService.log(
          `Updated existing submission ${saved.id} for chefsSubmissionId ${input.chefsSubmissionId}`,
        );
        return saved;
      } else {
        return this.createSubmission(input, user);
      }
    } catch (error) {
      this.loggerService.error(
        `Failed to upsert submission for chefsSubmissionId ${input.chefsSubmissionId}: ${error.message}`,
        null,
      );
      throw new Error(
        `Failed to upsert submission for chefsSubmissionId ${input.chefsSubmissionId}: ${error.message}`,
      );
    }
  }

  async getFormSchema(
    formId: string,
    apiKey: string,
    versionNumber: number,
  ): Promise<any> {
    try {
      this.loggerService.log(
        `Fetching form schema for formId ${formId}, version ${versionNumber}`,
      );
      const chefsBaseUrl = this.configService.get<string>('CHEFS_API_URL');
      if (!chefsBaseUrl) {
        throw new Error('CHEFS_API_URL is not configured');
      }
      const auth = Buffer.from(`${formId}:${apiKey}`).toString('base64');
      const headers = { Authorization: `Basic ${auth}` };

      const versionsResponse = await firstValueFrom(
        this.httpService.get(`${chefsBaseUrl}/forms/${formId}`, { headers }),
      );

      const versions: any[] = versionsResponse.data?.versions ?? [];
      if (!versions.length) {
        throw new Error(`No versions found for formId ${formId}`);
      }

      const matchedVersion = versions.find((v) => v.version === versionNumber);
      if (!matchedVersion) {
        throw new Error(
          `Version ${versionNumber} not found for formId ${formId}`,
        );
      }

      const schemaResponse = await firstValueFrom(
        this.httpService.get(
          `${chefsBaseUrl}/forms/${formId}/versions/${matchedVersion.id}`,
          { headers },
        ),
      );

      this.loggerService.log(
        `Form schema fetched successfully for formId ${formId}, version ${versionNumber}`,
      );
      return schemaResponse.data;
    } catch (error) {
      this.loggerService.error(
        `Failed to fetch form schema for formId ${formId}, version ${versionNumber}: ${error.message}`,
        null,
      );
      throw new Error(
        `Failed to fetch form schema for formId ${formId}: ${error.message}`,
      );
    }
  }

  async getFormSchemaByAppType(
    appTypeAbbrev: string,
    chefsFormId: string,
    versionNumber: number,
  ): Promise<any> {
    const config = getFormConfigByAppType(appTypeAbbrev);

    if (!config) {
      throw new Error(
        `No form configuration found for appType: ${appTypeAbbrev}`,
      );
    }

    const apiKey = this.configService.get<string>(config.apiKeyEnvKey);
    if (!apiKey) {
      throw new Error(
        `CHEFS API key not configured for appType ${appTypeAbbrev} (${config.apiKeyEnvKey})`,
      );
    }

    return this.getFormSchema(chefsFormId, apiKey, versionNumber);
  }
}
