import { print } from 'graphql';
import {
  APPLICATIONS_LOOKUPS_ERROR_MESSAGE,
  ApplicationsLookupsApiError,
  getApplicationsV2FilterLookupOptions,
} from './ApplicationsLookupsApi';
import { GetApplicationsV2FilterLookupsDocument } from './ApplicationsV2Lookups.generated';
import { GRAPHQL } from '../../../../helpers/endpoints';

const mockPost = vi.fn();

vi.mock('../../../../helpers/utility', () => ({
  getAxiosInstance: () => ({
    post: mockPost,
  }),
}));

const lookupPayload = {
  getAllActiveStaffMembers: {
    data: [
      { personId: 2, personFullName: 'Zoe Adams', currentCapacity: 1 },
      { personId: 1, personFullName: 'Ann Baker', currentCapacity: 0 },
    ],
  },
  getAllStatusTypes: [
    { id: 1, abbrev: 'O', description: 'Open' },
    { id: 2, abbrev: 'O2', description: 'Open' },
    { id: 3, abbrev: 'C', description: 'Closed' },
  ],
  getApplicationServiceTypes: {
    data: [
      { key: 'b', value: 'Beta' },
      { key: 'a', value: 'Alpha' },
    ],
  },
  getAllAppTypes: [
    { id: 2, abbrev: 'B', description: 'Beta Type' },
    { id: 1, abbrev: 'A', description: 'Alpha Type' },
  ],
};

describe('ApplicationsLookupsApi.getApplicationsV2FilterLookupOptions', () => {
  beforeEach(() => {
    mockPost.mockReset();
  });

  it('posts one combined lookup document and returns mapped options', async () => {
    mockPost.mockResolvedValue({
      data: { data: lookupPayload },
    });

    const result = await getApplicationsV2FilterLookupOptions();

    expect(mockPost).toHaveBeenCalledTimes(1);
    expect(mockPost).toHaveBeenCalledWith(
      GRAPHQL,
      {
        query: print(GetApplicationsV2FilterLookupsDocument),
        variables: undefined,
      },
      { signal: undefined },
    );
    expect(result).toEqual({
      serviceType: [
        { value: 'a', label: 'Alpha' },
        { value: 'b', label: 'Beta' },
      ],
      applicationType: [
        { value: '1', label: 'Alpha Type' },
        { value: '2', label: 'Beta Type' },
      ],
      status: [
        { value: 'Open', label: 'Open' },
        { value: 'Closed', label: 'Closed' },
      ],
      staffAssigned: [
        { value: '1', label: 'Ann Baker' },
        { value: '2', label: 'Zoe Adams' },
      ],
    });
  });

  it('forwards an abort signal to axios', async () => {
    const controller = new AbortController();
    mockPost.mockResolvedValue({
      data: { data: lookupPayload },
    });

    await getApplicationsV2FilterLookupOptions(controller.signal);

    expect(mockPost).toHaveBeenCalledWith(GRAPHQL, expect.any(Object), {
      signal: controller.signal,
    });
  });

  it('throws a safe domain error on GraphQL transport errors', async () => {
    mockPost.mockResolvedValue({
      data: { errors: [{ message: 'boom' }] },
    });

    await expect(getApplicationsV2FilterLookupOptions()).rejects.toEqual(
      new ApplicationsLookupsApiError(APPLICATIONS_LOOKUPS_ERROR_MESSAGE),
    );
  });

  it('throws a safe domain error when lookup data is missing', async () => {
    mockPost.mockResolvedValue({
      data: { data: {} },
    });

    await expect(getApplicationsV2FilterLookupOptions()).rejects.toBeInstanceOf(
      ApplicationsLookupsApiError,
    );
  });

  it('re-throws cancellation errors unchanged', async () => {
    const canceledError = Object.assign(new Error('Aborted'), {
      name: 'CanceledError',
    });
    mockPost.mockRejectedValue(canceledError);
    const controller = new AbortController();
    controller.abort();

    await expect(
      getApplicationsV2FilterLookupOptions(controller.signal),
    ).rejects.toBe(canceledError);
  });
});
