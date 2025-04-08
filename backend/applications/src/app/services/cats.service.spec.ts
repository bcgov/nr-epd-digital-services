import { Test, TestingModule } from '@nestjs/testing';
import { CatsService } from './cats.service';
import axios from 'axios';

jest.mock('axios'); // Mock axios to prevent real API calls

describe('CatsService', () => {
  let service: CatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CatsService],
    }).compile();

    service = module.get<CatsService>(CatsService);
  });

  describe('submitToCats', () => {
    it('should send a GraphQL mutation request to CATS API', async () => {
      process.env.CATS_API = 'http://mock-api.com/graphql'; // Mock API URL
      const mockFormData = { siteId: 123, hdnAppType: 'NEW' };
      const mockSubmissionId = 'sub-001';
      const mockFormId = 'form-001';
      const mockResponse = { data: { data: { createApplication: { id: 1 } } } };

      (axios.post as jest.Mock).mockResolvedValue(mockResponse);

      await service.submitToCats(mockFormData, mockSubmissionId, mockFormId);

      expect(axios.post).toHaveBeenCalledWith(
        'http://mock-api.com/graphql',
        expect.objectContaining({
          query: expect.stringContaining('mutation CreateNewApplication'),
          variables: expect.objectContaining({
            application: expect.objectContaining({
              formId: mockFormId,
              submissionId: mockSubmissionId,
              siteId: mockFormData.siteId,
              appTypeAbbrev: mockFormData.hdnAppType,
            }),
          }),
        }),
        { headers: { 'Content-Type': 'application/json' } }
      );
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
  });
});