import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosRequestConfig } from 'axios';

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

  private getFormApiKey(): string {
    return (
      this.configService.get<string>('CHEFS_NOM_API_KEY') ||
      process.env.CHEFS_NOM_API_KEY ||
      this.configService.get<string>('CHEFS_API_KEY') ||
      process.env.CHEFS_API_KEY ||
      ''
    );
  }

  private buildBasicAuthConfig(chefsFormId: string): AxiosRequestConfig {
    const apiKey = this.getFormApiKey();
    if (!apiKey) {
      throw new BadRequestException(
        'CHEFS form API key is not configured. Set CHEFS_NOM_API_KEY.',
      );
    }
    if (!chefsFormId?.trim()) {
      throw new BadRequestException('CHEFS form id is required for Basic Auth.');
    }

    return {
      auth: { username: chefsFormId, password: apiKey },
      headers: {
        Accept: 'application/json',
      },
    };
  }

  /**
   * Fetch submission notes from CHEFS (Basic Auth / form API key).
   * @see https://submit.digital.gov.bc.ca/app/api/v1/docs#tag/Status/operation/readSubmissioNotes
   */
  async getSubmissionNotes(
    chefsFormId: string,
    chefsSubmissionId: string,
  ): Promise<ChefsSubmissionNote[]> {
    const url = `${this.baseUrl}/submissions/${chefsSubmissionId}/notes`;
    const config = this.buildBasicAuthConfig(chefsFormId);

    this.logger.log(`CHEFS GET ${url} auth=basic`);

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
