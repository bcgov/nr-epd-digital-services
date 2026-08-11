import type { FilterPill } from '../../../../components/filter/filterPill';
import {
  APPLICATIONS_V2_FILTER_FIELDS,
  type ApplicationsV2FilterField,
} from './applicationsV2FilterConfig';

export type ApplicationsV2AdvancedFilters = {
  id: string;
  serviceType: string;
  applicationType: string;
  commonName: string;
  csapReference: string;
  siteId: string;
  siteAddress: string;
  siteRiskClassification: string;
  status: string;
  staffAssigned: string;
  priority: string;
  invoiceStatus: string;
  dateReceivedFrom: string;
  dateReceivedTo: string;
  lastUpdatedFrom: string;
  lastUpdatedTo: string;
  dateCompletedFrom: string;
  dateCompletedTo: string;
};

export type ApplicationsV2AdvancedFilterUrlKey =
  keyof ApplicationsV2AdvancedFilters;

export const EMPTY_ADVANCED_FILTERS: ApplicationsV2AdvancedFilters = {
  id: '',
  serviceType: '',
  applicationType: '',
  commonName: '',
  csapReference: '',
  siteId: '',
  siteAddress: '',
  siteRiskClassification: '',
  status: '',
  staffAssigned: '',
  priority: '',
  invoiceStatus: '',
  dateReceivedFrom: '',
  dateReceivedTo: '',
  lastUpdatedFrom: '',
  lastUpdatedTo: '',
  dateCompletedFrom: '',
  dateCompletedTo: '',
};

export const ADVANCED_FILTER_URL_KEYS = Object.keys(
  EMPTY_ADVANCED_FILTERS,
) as ApplicationsV2AdvancedFilterUrlKey[];

const asString = (value: string | null | undefined): string =>
  typeof value === 'string' ? value : '';

export const parseAdvancedFiltersFromUrl = (
  params: Partial<Record<ApplicationsV2AdvancedFilterUrlKey, string | null>>,
): ApplicationsV2AdvancedFilters => ({
  id: asString(params.id),
  serviceType: asString(params.serviceType),
  applicationType: asString(params.applicationType),
  commonName: asString(params.commonName),
  csapReference: asString(params.csapReference),
  siteId: asString(params.siteId),
  siteAddress: asString(params.siteAddress),
  siteRiskClassification: asString(params.siteRiskClassification),
  status: asString(params.status),
  staffAssigned: asString(params.staffAssigned),
  priority: asString(params.priority),
  invoiceStatus: asString(params.invoiceStatus),
  dateReceivedFrom: asString(params.dateReceivedFrom),
  dateReceivedTo: asString(params.dateReceivedTo),
  lastUpdatedFrom: asString(params.lastUpdatedFrom),
  lastUpdatedTo: asString(params.lastUpdatedTo),
  dateCompletedFrom: asString(params.dateCompletedFrom),
  dateCompletedTo: asString(params.dateCompletedTo),
});

export const advancedFiltersToGraphqlVariables = (
  filters: ApplicationsV2AdvancedFilters,
) => {
  const variables: Record<string, string> = {};

  if (filters.id) variables.filterId = filters.id;
  if (filters.serviceType) variables.filterServiceType = filters.serviceType;
  if (filters.applicationType)
    variables.filterApplicationType = filters.applicationType;
  if (filters.commonName) variables.filterCommonName = filters.commonName;
  if (filters.csapReference)
    variables.filterCsapReference = filters.csapReference;
  if (filters.siteId) variables.filterSiteId = filters.siteId;
  if (filters.siteAddress) variables.filterSiteAddress = filters.siteAddress;
  if (filters.siteRiskClassification)
    variables.filterSiteRiskClassification = filters.siteRiskClassification;
  if (filters.status) variables.filterStatus = filters.status;
  if (filters.staffAssigned)
    variables.filterStaffAssigned = filters.staffAssigned;
  if (filters.priority) variables.filterPriority = filters.priority;
  if (filters.invoiceStatus)
    variables.filterInvoiceStatus = filters.invoiceStatus;
  if (filters.dateReceivedFrom)
    variables.filterDateReceivedFrom = filters.dateReceivedFrom;
  if (filters.dateReceivedTo)
    variables.filterDateReceivedTo = filters.dateReceivedTo;
  if (filters.lastUpdatedFrom)
    variables.filterLastUpdatedFrom = filters.lastUpdatedFrom;
  if (filters.lastUpdatedTo)
    variables.filterLastUpdatedTo = filters.lastUpdatedTo;
  if (filters.dateCompletedFrom)
    variables.filterDateCompletedFrom = filters.dateCompletedFrom;
  if (filters.dateCompletedTo)
    variables.filterDateCompletedTo = filters.dateCompletedTo;

  return variables;
};

export const urlUpdatesFromAdvancedFilters = (
  filters: ApplicationsV2AdvancedFilters,
): Record<ApplicationsV2AdvancedFilterUrlKey, string | undefined> => {
  const updates = {} as Record<
    ApplicationsV2AdvancedFilterUrlKey,
    string | undefined
  >;

  for (const key of ADVANCED_FILTER_URL_KEYS) {
    const value = filters[key].trim();
    updates[key] = value || undefined;
  }

  return updates;
};

export const clearedAdvancedFilterUrlUpdates = (): Record<
  ApplicationsV2AdvancedFilterUrlKey,
  undefined
> => {
  const updates = {} as Record<ApplicationsV2AdvancedFilterUrlKey, undefined>;
  for (const key of ADVANCED_FILTER_URL_KEYS) {
    updates[key] = undefined;
  }
  return updates;
};

const displayValueFor = (
  field: Extract<ApplicationsV2FilterField, { kind: 'select' }>,
  value: string,
): string =>
  field.options.find((option) => option.value === value)?.label ?? value;

const formatDateRange = (from: string, to: string): string => {
  if (from && to) return `${from} - ${to}`;
  return from || to;
};

export const advancedFiltersToPills = (
  filters: ApplicationsV2AdvancedFilters,
  fields: ApplicationsV2FilterField[] = APPLICATIONS_V2_FILTER_FIELDS,
): FilterPill[] => {
  const pills: FilterPill[] = [];

  for (const field of fields) {
    if (field.kind === 'dateRange') {
      const from = filters[field.fromKey];
      const to = filters[field.toKey];
      if (!from && !to) continue;
      pills.push({
        key: field.key,
        label: field.label,
        value: formatDateRange(from, to),
      });
      continue;
    }

    const value = filters[field.key];
    if (!value) continue;

    pills.push({
      key: field.key,
      label: field.label,
      value: field.kind === 'select' ? displayValueFor(field, value) : value,
    });
  }

  return pills;
};

export const urlKeysForPill = (
  pillKey: string,
): ApplicationsV2AdvancedFilterUrlKey[] => {
  const field = APPLICATIONS_V2_FILTER_FIELDS.find(
    (candidate) => candidate.key === pillKey,
  );

  if (!field) {
    return [];
  }

  if (field.kind === 'dateRange') {
    return [field.fromKey, field.toKey];
  }

  return [field.key];
};
