import {
  advancedFiltersToGraphqlVariables,
  advancedFiltersToPills,
  EMPTY_ADVANCED_FILTERS,
  parseAdvancedFiltersFromUrl,
  urlKeysForPill,
  urlUpdatesFromAdvancedFilters,
} from './applicationsV2Filters';

describe('applicationsV2Filters', () => {
  describe('URL ↔ GraphQL mapping', () => {
    it('maps empty advanced filters to no GraphQL filter variables', () => {
      expect(
        advancedFiltersToGraphqlVariables(EMPTY_ADVANCED_FILTERS),
      ).toEqual({});
    });

    it('maps each applied advanced field to its GraphQL filter variable(s)', () => {
      const filters = parseAdvancedFiltersFromUrl({
        id: '1, 2',
        commonName: 'acme',
        csapReference: 'CSAP-9',
        siteId: '42',
        siteAddress: 'Main St',
        siteRiskClassification: 'highRisk',
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
        filterCommonName: 'acme',
        filterCsapReference: 'CSAP-9',
        filterSiteId: '42',
        filterSiteAddress: 'Main St',
        filterSiteRiskClassification: 'highRisk',
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
          priority: 'Low',
          dateReceivedFrom: '2024-01-01',
          dateReceivedTo: '',
          commonName: '',
        }),
      ).toEqual({
        id: '9',
        commonName: undefined,
        csapReference: undefined,
        siteId: undefined,
        siteAddress: undefined,
        siteRiskClassification: undefined,
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
          key: 'dateReceived',
          label: 'Date Received',
          value: '2024-01-01 - 2024-01-31',
        },
        { key: 'priority', label: 'Priority', value: 'High' },
        {
          key: 'siteRiskClassification',
          label: 'Site Risk Classification',
          value: 'High Risk',
        },
        { key: 'invoiceStatus', label: 'Invoice Status', value: 'Draft' },
      ]);
    });

    it('maps a pill key to the URL keys it should clear', () => {
      expect(urlKeysForPill('id')).toEqual(['id']);
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
