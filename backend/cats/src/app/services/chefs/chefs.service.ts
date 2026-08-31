import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosRequestConfig } from 'axios';
import {
  FORM_REGISTRY,
  FormConfig,
  getFormConfigByAppType,
} from '../formIntake/formIntake.constants';

export type ChefsSubmissionNote = {
  id: string;
  submissionId: string;
  submissionStatusId: string | null;
  note: string;
  userId: string | null;
  createdBy: string | null;
  createdAt: string;
  updatedBy: string | null;
  updatedAt: string | null;
};

@Injectable()
export class ChefsService {
  private readonly logger = new Logger(ChefsService.name);

  constructor(private readonly configService: ConfigService) {}

  private get baseUrl(): string {
    return (
      this.configService.get<string>('CHEFS_API_URL') ||
      process.env.CHEFS_API_URL ||
      'https://submit.digital.gov.bc.ca/app/api/v1'
    ).replace(/\/$/, '');
  }

  private getEnv(key: string): string {
    return (
      this.configService.get<string>(key) || process.env[key] || ''
    ).trim();
  }

  /**
   * Resolve the form API key from FORM_REGISTRY (form-agnostic).
   * Prefer matching chefsFormId to configured CHEFS_*_FORM_ID values;
   * fall back to appTypeAbbrev when form IDs are not set in env.
   */
  private resolveFormConfig(
    chefsFormId: string,
    appTypeAbbrev?: string | null,
  ): FormConfig {
    const trimmedFormId = chefsFormId?.trim();
    if (trimmedFormId) {
      for (const config of Object.values(FORM_REGISTRY)) {
        const configuredFormId = this.getEnv(config.chefsFormIdEnvKey);
        if (configuredFormId && configuredFormId === trimmedFormId) {
          return config;
        }
      }
    }

    if (appTypeAbbrev?.trim()) {
      const byAppType = getFormConfigByAppType(appTypeAbbrev.trim());
      if (byAppType) {
        return byAppType;
      }
    }

    throw new BadRequestException(
      `No CHEFS form configuration found for form id "${chefsFormId}"` +
        (appTypeAbbrev ? ` / app type "${appTypeAbbrev}"` : '') +
        '. Ensure the form is in FORM_REGISTRY and its FORM_ID / API_KEY env vars are set.',
    );
  }

  private getFormApiKey(config: FormConfig): string {
    const apiKey = this.getEnv(config.apiKeyEnvKey);
    if (!apiKey) {
      throw new BadRequestException(
        `CHEFS form API key is not configured for ${config.appTypeAbbrev}. Set ${config.apiKeyEnvKey}.`,
      );
    }
    return apiKey;
  }

  private buildBasicAuthConfig(
    chefsFormId: string,
    appTypeAbbrev?: string | null,
  ): AxiosRequestConfig {
    if (!chefsFormId?.trim()) {
      throw new BadRequestException('CHEFS form id is required for Basic Auth.');
    }

    const formConfig = this.resolveFormConfig(chefsFormId, appTypeAbbrev);
    const apiKey = this.getFormApiKey(formConfig);

    return {
      auth: { username: chefsFormId, password: apiKey },
      headers: {
        Accept: 'application/json',
      },
    };
  }

  /**
   * Fetch submission notes from CHEFS (Basic Auth / form API key).
   * API key is resolved per form via FORM_REGISTRY.
   * @see https://submit.digital.gov.bc.ca/app/api/v1/docs#tag/Status/operation/readSubmissioNotes
   */
  async getSubmissionNotes(
    chefsFormId: string,
    chefsSubmissionId: string,
    appTypeAbbrev?: string | null,
  ): Promise<ChefsSubmissionNote[]> {
    const url = `${this.baseUrl}/submissions/${chefsSubmissionId}/notes`;
    const config = this.buildBasicAuthConfig(chefsFormId, appTypeAbbrev);

    this.logger.log(
      `CHEFS GET ${url} auth=basic formId=${chefsFormId}` +
        (appTypeAbbrev ? ` appType=${appTypeAbbrev}` : ''),
    );

    try {
      const response = await axios.get(url, config);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const detail =
          (error.response?.data as { detail?: string })?.detail ||
          error.message;
        const message = `CHEFS getSubmissionNotes failed (${status ?? 'network'}). Detail: ${detail}`;
        this.logger.error(message);
        if (status === 401 || status === 403) {
          throw new UnauthorizedException(message);
        }
        throw new BadRequestException(message);
      }
      throw error;
    }
  }
}
