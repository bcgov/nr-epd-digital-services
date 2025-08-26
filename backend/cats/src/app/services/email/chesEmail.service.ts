import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import * as qs from 'qs';
import { LoggerService } from '../../logger/logger.service';

@Injectable()
export class ChesEmailService {
  private tokenUrl: string;
  private emailUrl: string;
  private clientId: string;
  private clientSecret: string;
  private fromAddress: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly loggerService: LoggerService,
  ) {
    this.tokenUrl = this.configService.get<string>('CHES_TOKEN_URL');
    this.emailUrl = this.configService.get<string>('CHES_EMAIL_URL');
    this.clientId = this.configService.get<string>('CHES_CLIENT_ID');
    this.clientSecret = this.configService.get<string>('CHES_CLIENT_SECRET');
    this.fromAddress = this.configService.get<string>('CHES_EMAIL_FROM');
  }

  protected async getAccessToken(): Promise<string> {
    this.loggerService.log('Getting Access Token');
    const data = qs.stringify({
      grant_type: 'client_credentials',
      client_id: this.clientId,
      client_secret: this.clientSecret,
    });

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post(this.tokenUrl, data, { headers }),
      );
      return response.data.access_token;
    } catch (error) {
      console.error(
        'Access Token Error:',
        error?.response?.data || error.message,
      );
      throw new HttpException(
        'Failed to retrieve access token',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async sendEmail(
    to: string[],
    subject: string,
    body: string,
    bodyType: string = 'html',
    priority: string = 'normal',
    attachments: any[] = [],
  ): Promise<void> {
    try {
      const token = await this.getAccessToken();
      this.loggerService.log('Sending Email start');
      const payload = {
        bcc: [],
        bodyType: bodyType,
        body,
        cc: [],
        delayTS: 0,
        encoding: 'utf-8',
        from: this.fromAddress,
        priority: priority,
        subject,
        to,
        tag: '',
        attachments: attachments,
      };

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      let result = this.httpService.post(this.emailUrl, payload, { headers });

      await firstValueFrom(result);
      this.loggerService.log('Sending Email end');
    } catch (error) {
      this.loggerService.error('Email Sending Error', JSON.stringify(error));
      console.error(
        'Email Sending Error:',
        error?.response?.data || error.message,
      );
      throw new HttpException(
        'Failed to send email',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
