import { Test, TestingModule } from '@nestjs/testing';
import { CatsService } from './cats.service';
import axios from 'axios';

jest.mock('axios'); // Prevent actual HTTP requests

describe('CatsService', () => {
  let service: CatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CatsService],
    }).compile();

    service = module.get<CatsService>(CatsService);
    jest.clearAllMocks();
  });

  describe('submitToCats', () => {
    it('should send a GraphQL mutation request to CATS API with required applicationStatus', async () => {
      process.env.CATS_API = 'http://mock-api.com/graphql';

      const mockFormData = { siteId: 123, hdnAppType: 'NEW' };
      const mockSubmissionId = 'sub-001';
      const mockFormId = 'form-001';

      const fixedDate = new Date('2025-06-18T12:00:00Z');
      const isoDate = fixedDate.toISOString();

      // Mock global Date constructor
      const originalDate = global.Date;
      global.Date = class extends Date {
        constructor() {
          super();
          return fixedDate;
        }
      } as any;

      const mockResponse = {
        data: {
          data: {
            createApplication: {
              message: 'Success',
              httpStatusCode: 200,
              success: true,
              timestamp: '2025-06-18T00:00:00.000Z',
              data: { id: 1 },
            },
          },
        },
      };

      (axios.post as jest.Mock).mockResolvedValue(mockResponse);

      await service.submitToCats(mockFormData, mockSubmissionId, mockFormId);

      expect(axios.post).toHaveBeenCalledTimes(1);

      const callArgs = (axios.post as jest.Mock).mock.calls[0];
      expect(callArgs[0]).toBe('http://mock-api.com/graphql');

      expect(callArgs[1]).toMatchObject({
        variables: {
          application: {
            siteId: mockFormData.siteId,
            appTypeAbbrev: mockFormData.hdnAppType,
            receivedDate: fixedDate,
            applicationStatus: [
              {
                statusTypeAbbrev: 'New',
                isCurrent: true,
                applicationId: 0,
                formId: mockFormId,
                submissionId: mockSubmissionId,
              },
            ],
          },
        }
      });


      // Restore the original Date
      global.Date = originalDate;
    });

    it('should handle errors gracefully', async () => {
      process.env.CATS_API = 'http://mock-api.com/graphql';

      const mockFormData = { siteId: 123, hdnAppType: 'NEW' };
      const mockSubmissionId = 'sub-001';
      const mockFormId = 'form-001';

      (axios.post as jest.Mock).mockRejectedValue(new Error('Request failed'));

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      await expect(
        service.submitToCats(mockFormData, mockSubmissionId, mockFormId)
      ).resolves.toBeUndefined();

      expect(consoleSpy).toHaveBeenCalledWith(
        'Error:',
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });

    it('should log when siteId is missing and not call axios', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const formData = { hdnAppType: 'CSR' }; // siteId missing
      const submissionId = 'sub-001';
      const formId = 'form-001';

      await service.submitToCats(formData, submissionId, formId);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining(`Site Id not available, application not created in CATS for formID:${formId} submissionId:${submissionId}`)
      );

      expect(axios.post).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
});
