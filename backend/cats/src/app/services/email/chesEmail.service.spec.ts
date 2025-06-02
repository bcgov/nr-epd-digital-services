import { Test, TestingModule } from '@nestjs/testing';
import { ChesEmailService } from './chesEmail.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { HttpException } from '@nestjs/common';
import { LoggerService } from '../../logger/logger.service';

// ✅ Mock firstValueFrom properly
jest.mock('rxjs', () => ({
  ...jest.requireActual('rxjs'),
  firstValueFrom: jest.fn(),
}));

describe('ChesEmailService', () => {
  let service: ChesEmailService;
  let httpService: HttpService;
  let configService: ConfigService;
  let loggerService: LoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChesEmailService,
        {
          provide: HttpService,
          useValue: {
            post: jest.fn(),
          },
        },
        {
          provide: LoggerService,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
            debug: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'CHES_EMAIL_URL') return 'https://example.com/email';
              return undefined;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<ChesEmailService>(ChesEmailService);
    httpService = module.get<HttpService>(HttpService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should send email successfully', async () => {
    const to = ['test@example.com'];
    const subject = 'Test Email';
    const body = 'Hello World!';
    const token = 'access-token';
    const emailUrl = 'https://example.com/email';

    (configService.get as jest.Mock).mockImplementation((key: string) => {
      if (key === 'CHES_EMAIL_URL') return 'https://example.com/email';
      return undefined;
    });

    (httpService.post as jest.Mock).mockResolvedValue({ data: {} });
    (service as any).getAccessToken = jest.fn().mockResolvedValue(token);
    (firstValueFrom as jest.Mock).mockResolvedValue({ data: {} });

    await service.sendEmail(to, subject, body);

    expect(httpService.post).toHaveBeenCalledTimes(1);
    expect(httpService.post).toHaveBeenCalledWith(
      emailUrl,
      expect.any(Object),
      expect.any(Object),
    );
  });

  //   it('should throw error if access token is not obtained', async () => {
  //     const to = ['test@example.com'];
  //     const subject = 'Test Email';
  //     const body = 'Hello World!';

  //     (service as any).getAccessToken = jest
  //       .fn()
  //       .mockRejectedValue(new Error('Access token error'));

  //     await expect(service.sendEmail(to, subject, body)).rejects.toThrow(
  //       HttpException,
  //     );
  //   });

  //   it('should throw error if to, subject, or body is empty', async () => {
  //     const to = [];
  //     const subject = '';
  //     const body = '';

  //     await expect(service.sendEmail(to, subject, body)).rejects.toThrow(
  //       HttpException,
  //     );
  //   });
});
