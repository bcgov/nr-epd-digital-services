import { CatsService, getNomSiteIdsFromFormData } from './cats.service';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('CatsService', () => {
  let service: CatsService;

  beforeEach(() => {
    service = new CatsService();
    process.env.CATS_API = 'http://cats:4005/graphql';
    jest.clearAllMocks();
  });

  describe('getNomSiteIdsFromFormData', () => {
    it('reads S2-siteIdNumber from live NOM CHEFS form', () => {
      expect(
        getNomSiteIdsFromFormData({
          'S2-siteIdNumber': '100001',
        }),
      ).toEqual([100001]);
    });

    it('reads siteIdNumber and contactParcelSiteIdNumber from dataGrid', () => {
      expect(
        getNomSiteIdsFromFormData({
          siteIdNumber: '200002',
          dataGrid: [
            { contactParcelSiteIdNumber: '100001' },
            { contactParcelSiteIdNumber: '100001,200002' },
          ],
        }),
      ).toEqual([200002, 100001]);
    });

    it('parses dataGrid when stored as JSON string', () => {
      expect(
        getNomSiteIdsFromFormData({
          dataGrid: JSON.stringify([
            { contactParcelSiteIdNumber: '300003' },
          ]),
        }),
      ).toEqual([300003]);
    });
  });

  describe('getSiteIdsFromFormData (NOM)', () => {
    it('delegates to NOM field mapping when hdnAppType is NOM', () => {
      expect(
        service.getSiteIdsFromFormData({
          hdnAppType: 'NOM',
          'S2-siteIdNumber': '42',
        }),
      ).toEqual([42]);
    });
  });

  describe('submitToCats', () => {
    const submissionId = 'sub123';
    const formId = 'form123';
    const formData = {
      siteId: '101, 123',
      hdnAppType: 'TYPE_A',
      applicationId: 100001,
    };

    it('should call axios.post with the correct payload when siteId is present', async () => {
      const mockResponse = {
        data: {
          data: {
            createApplication: {
              message: 'Created',
              httpStatusCode: 200,
              success: true,
              timestamp: '2025-06-26T00:00:00Z',
              data: {
                id: 1,
              },
            },
          },
        },
      };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const appId = await service.submitToCats(formData, submissionId, formId);

      expect(appId).toBe(1);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        process.env.CATS_API,
        {
          query: expect.stringContaining('mutation CreateNewApplication'),
          variables: {
            application: expect.objectContaining({
              siteIds: [101, 123],
              appTypeAbbrev: 'TYPE_A',
              receivedDate: expect.anything(), // could be string or Date
              applicationStatus: expect.arrayContaining([
                expect.objectContaining({
                  applicationId: 0,
                  formId: 'form123',
                  submissionId: 'sub123',
                  formsflowAppId: 100001,
                  isCurrent: true,
                  statusTypeAbbrev: 'New',
                }),
              ]),
            }),
          },
        },
        { headers: { 'Content-Type': 'application/json' } },
      );
    });

    it('should return null and log error if axios.post throws', async () => {
      const error = new Error('Network error');
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      mockedAxios.post.mockRejectedValueOnce(error);

      const appId = await service.submitToCats(formData, submissionId, formId);

      expect(appId).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error creating CATS application:',
        error,
      );

      consoleSpy.mockRestore();
    });
  });

  describe('updateCatsApplication', () => {
    const submissionId = 'sub456';
    const formId = 'form456';
    const formData = {
      applicationId: 99999,
      applicationStatus: 'New',
      siteId: '123,111',
    };

    const statusTypeAbbrev = 'New';
    const siteIds = [123, 111];

    it('should call axios.post and return the response data', async () => {
      const mockResponse = {
        data: {
          data: {
            updateFormsflowAppId: {
              message: 'Updated',
              httpStatusCode: 200,
              success: true,
              timestamp: '2025-06-26T00:00:00Z',
              data: {
                formsflowAppId: 99999,
              },
            },
          },
        },
      };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const result = await service.updateCatsApplication(
        submissionId,
        formId,
        formData,
      );

      expect(mockedAxios.post).toHaveBeenCalledWith(
        process.env.CATS_API,
        expect.objectContaining({
          query: expect.stringContaining('mutation UpdateFormsflowAppId'),
          variables: {
            appStatusInput: {
              submissionId,
              formId,
              formsflowAppId: Number(formData.applicationId),
              statusTypeAbbrev,
              siteIds,
            },
          },
        }),
        { headers: { 'Content-Type': 'application/json' } },
      );

      expect(result).toEqual(mockResponse.data);
    });

    it('should throw an error if axios.post fails', async () => {
      const error = new Error('Update failed');
      mockedAxios.post.mockRejectedValueOnce(error);

      await expect(
        service.updateCatsApplication(submissionId, formId, formData),
      ).rejects.toThrow('Update failed');
    });
  });
});
