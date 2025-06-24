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
  });

  describe('submitToCats', () => {
    it('should send a GraphQL mutation request to CATS API with required applicationStatus', async () => {
      process.env.CATS_API = 'http://mock-api.com/graphql';

      const mockFormData = { siteId: 123, hdnAppType: 'NEW' };
      const mockSubmissionId = 'sub-001';
      const mockFormId = 'form-001';

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

      const now = new Date();
      const isoDate = now.toISOString();
      jest.useFakeTimers().setSystemTime(now); // freeze time

      await service.submitToCats(mockFormData, mockSubmissionId, mockFormId);

      expect(axios.post).toHaveBeenCalledWith(
        'http://mock-api.com/graphql',
        expect.objectContaining({
          query: expect.stringContaining('mutation CreateNewApplication'),
          variables: {
            application: {
              siteId: mockFormData.siteId,
              appTypeAbbrev: mockFormData.hdnAppType,
              receivedDate: isoDate,
              applicationStatus: [
                {
                  statusTypeId: 1,
                  isCurrent: true,
                  applicationId: 0,
                  formId: mockFormId,
                  submissionId: mockSubmissionId,
                },
              ],
            },
          },
        }),
        { headers: { 'Content-Type': 'application/json' } }
      );

      jest.useRealTimers();
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
        expect.stringContaining('Site Id not available'),
        expect.any(String)
      );

      expect(axios.post).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
});
