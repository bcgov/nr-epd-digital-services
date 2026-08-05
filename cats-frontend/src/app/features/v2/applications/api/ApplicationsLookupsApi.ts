import { print } from 'graphql';
import { GRAPHQL } from '../../../../helpers/endpoints';
import { getAxiosInstance } from '../../../../helpers/utility';
import type {
  ApplicationsV2FilterOption,
  ApplicationsV2LookupOptions,
} from '../filters/applicationsV2FilterConfig';
import { GetApplicationsV2FilterLookupsDocument } from './ApplicationsV2Lookups.generated';

export const APPLICATIONS_LOOKUPS_ERROR_MESSAGE =
  'Unable to load filter options. Please try again.';

export class ApplicationsLookupsApiError extends Error {
  constructor(message: string = APPLICATIONS_LOOKUPS_ERROR_MESSAGE) {
    super(message);
    this.name = 'ApplicationsLookupsApiError';
  }
}

const sortByLabel = (
  options: ApplicationsV2FilterOption[],
): ApplicationsV2FilterOption[] =>
  [...options].sort((a, b) => a.label.localeCompare(b.label));

const dedupeByValue = (
  options: ApplicationsV2FilterOption[],
): ApplicationsV2FilterOption[] =>
  Array.from(
    new Map(options.map((option) => [option.value, option])).values(),
  );

export const getApplicationsV2FilterLookupOptions = async (
  signal?: AbortSignal,
): Promise<ApplicationsV2LookupOptions> => {
  try {
    const response = await getAxiosInstance().post(
      GRAPHQL,
      {
        query: print(GetApplicationsV2FilterLookupsDocument),
        variables: undefined,
      },
      { signal },
    );

    if (response.data?.errors?.length > 0) {
      throw new ApplicationsLookupsApiError();
    }

    const data = response.data?.data;
    const staff = data?.getAllActiveStaffMembers?.data;
    const statuses = data?.getAllStatusTypes;
    const serviceTypes = data?.getApplicationServiceTypes?.data;
    const appTypes = data?.getAllAppTypes;

    if (!staff || !statuses || !serviceTypes || !appTypes) {
      throw new ApplicationsLookupsApiError();
    }

    return {
      serviceType: sortByLabel(
        serviceTypes.map((serviceType: { key: string; value: string }) => ({
          value: serviceType.key,
          label: serviceType.value,
        })),
      ),
      applicationType: sortByLabel(
        appTypes.map((appType: { id: number; description: string }) => ({
          value: appType.id.toString(),
          label: appType.description,
        })),
      ),
      status: dedupeByValue(
        statuses.map((status: { description: string }) => ({
          value: status.description,
          label: status.description,
        })),
      ),
      staffAssigned: sortByLabel(
        staff.map(
          (member: { personId: number; personFullName: string }) => ({
            value: member.personId.toString(),
            label: member.personFullName,
          }),
        ),
      ),
    };
  } catch (error) {
    if (error instanceof ApplicationsLookupsApiError) {
      throw error;
    }
    if (
      (error as { name?: string })?.name === 'CanceledError' ||
      signal?.aborted
    ) {
      throw error;
    }
    throw new ApplicationsLookupsApiError();
  }
};
