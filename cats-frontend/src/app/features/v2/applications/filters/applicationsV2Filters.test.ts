import {
  advancedFiltersToGraphqlVariables,
  advancedFiltersToPills,
  EMPTY_ADVANCED_FILTERS,
  parseAdvancedFiltersFromUrl,
  urlKeysForPill,
  urlUpdatesFromAdvancedFilters,
} from './applicationsV2Filters';
import {
  resolveApplicationsV2FilterFields,
  type ApplicationsV2LookupOptions,
} from './applicationsV2FilterConfig';

const lookupOptions: ApplicationsV2LookupOptions = {
  serviceType: [{ value: 'svc-1', label: 'Service One' }],
  applicationType: [{ value: '3', label: 'Type Three' }],
  status: [{ value: 'Open', label: 'Open' }],
  staffAssigned: [{ value: '12', label: 'Ann Baker' }],
};

describe('applicationsV2Filters', () => {
  describe('URL ↔ GraphQL mapping', () => {
    it('maps empty advanced filters to no GraphQL filter variables', () => {
      expect(advancedFiltersToGraphqlVariables(EMPTY_ADVANCED_FILTERS)).toEqual(
        {},
      );
    });

    it('maps each applied advanced field to its GraphQL filter variable(s)', () => {
      const filters = parseAdvancedFiltersFromUrl({
        id: '1, 2',
        serviceType: 'svc-1',
        applicationType: '3',
        commonName: 'acme',
        csapReference: 'CSAP-9',
        siteId: '42',
        siteAddress: 'Main St',
        siteRiskClassification: 'highRisk',
        status: 'Open',
        staffAssigned: '12',
        priority: 'High',
        invoiceStatus: 'draft',
        dateReceivedFrom: '2024-01-01',
        dateReceivedTo: '2024-01-31',
        lastUpdatedFrom: '2024-02-01',
        lastUpdatedTo: '2024-02-28',
        dateCompletedFrom: '2024-03-01',
        dateCompletedTo: '2024-03-31',
      });

      expect(advancedFiltersToGraphqlVariables(filters)).toEqual({
        filterId: '1, 2',
        filterServiceType: 'svc-1',
        filterApplicationType: '3',
        filterCommonName: 'acme',
        filterCsapReference: 'CSAP-9',
        filterSiteId: '42',
        filterSiteAddress: 'Main St',
        filterSiteRiskClassification: 'highRisk',
        filterStatus: 'Open',
        filterStaffAssigned: '12',
        filterPriority: 'High',
        filterInvoiceStatus: 'draft',
        filterDateReceivedFrom: '2024-01-01',
        filterDateReceivedTo: '2024-01-31',
        filterLastUpdatedFrom: '2024-02-01',
        filterLastUpdatedTo: '2024-02-28',
        filterDateCompletedFrom: '2024-03-01',
        filterDateCompletedTo: '2024-03-31',
      });
    });

    it('round-trips form values into URL updates that omit empty keys', () => {
      expect(
        urlUpdatesFromAdvancedFilters({
          ...EMPTY_ADVANCED_FILTERS,
          id: '9',
          serviceType: 'svc-1',
          priority: 'Low',
          dateReceivedFrom: '2024-01-01',
          dateReceivedTo: '',
          commonName: '',
        }),
      ).toEqual({
        id: '9',
        serviceType: 'svc-1',
        applicationType: undefined,
        commonName: undefined,
        csapReference: undefined,
        siteId: undefined,
        siteAddress: undefined,
        siteRiskClassification: undefined,
        status: undefined,
        staffAssigned: undefined,
        priority: 'Low',
        invoiceStatus: undefined,
        dateReceivedFrom: '2024-01-01',
        dateReceivedTo: undefined,
        lastUpdatedFrom: undefined,
        lastUpdatedTo: undefined,
        dateCompletedFrom: undefined,
        dateCompletedTo: undefined,
      });
    });
  });

  describe('pills', () => {
    it('derives removable pills from applied URL filters', () => {
      const pills = advancedFiltersToPills(
        parseAdvancedFiltersFromUrl({
          id: '1,2',
          priority: 'High',
          siteRiskClassification: 'highRisk',
          invoiceStatus: 'draft',
          dateReceivedFrom: '2024-01-01',
          dateReceivedTo: '2024-01-31',
        }),
      );

      expect(pills).toEqual([
        { key: 'id', label: 'Application ID', value: '1,2' },
        {
          key: 'siteRiskClassification',
          label: 'Site Risk Classification',
          value: 'High Risk',
        },
        { key: 'priority', label: 'Priority', value: 'High' },
        {
          key: 'dateReceived',
          label: 'Date Received',
          value: '2024-01-01 - 2024-01-31',
        },
        { key: 'invoiceStatus', label: 'Invoice Status', value: 'Draft' },
      ]);
    });

    it('resolves lookup dropdown pill labels from live options', () => {
      const fields = resolveApplicationsV2FilterFields(lookupOptions);
      const pills = advancedFiltersToPills(
        parseAdvancedFiltersFromUrl({
          serviceType: 'svc-1',
          applicationType: '3',
          status: 'Open',
          staffAssigned: '12',
        }),
        fields,
      );

      expect(pills).toEqual([
        { key: 'serviceType', label: 'Service Type', value: 'Service One' },
        {
          key: 'applicationType',
          label: 'Application Type',
          value: 'Type Three',
        },
        { key: 'staffAssigned', label: 'Staff Assigned', value: 'Ann Baker' },
        { key: 'status', label: 'Status', value: 'Open' },
      ]);
    });

    it('maps a pill key to the URL keys it should clear', () => {
      expect(urlKeysForPill('id')).toEqual(['id']);
      expect(urlKeysForPill('serviceType')).toEqual(['serviceType']);
      expect(urlKeysForPill('staffAssigned')).toEqual(['staffAssigned']);
      expect(urlKeysForPill('dateReceived')).toEqual([
        'dateReceivedFrom',
        'dateReceivedTo',
      ]);
      expect(urlKeysForPill('lastUpdated')).toEqual([
        'lastUpdatedFrom',
        'lastUpdatedTo',
      ]);
      expect(urlKeysForPill('dateCompleted')).toEqual([
        'dateCompletedFrom',
        'dateCompletedTo',
      ]);
    });
  });
});
