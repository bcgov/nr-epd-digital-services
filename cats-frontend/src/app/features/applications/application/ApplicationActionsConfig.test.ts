import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  ApplicationAction,
  buildApplicationExportPdfTitle,
  buildSiteRegistryEditTabUrl,
  getApplicationActionItems,
  getSiteRegistryTabForAction,
  isSdsAppType,
  printApplicationFormAsPdf,
} from './ApplicationActionsConfig';

describe('ApplicationActionsConfig', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe('isSdsAppType', () => {
    it('detects SDS by abbrev', () => {
      expect(isSdsAppType({ abbrev: 'SDS' })).toBe(true);
      expect(isSdsAppType({ abbrev: 'sds' })).toBe(true);
    });

    it('detects SDS by description', () => {
      expect(isSdsAppType({ description: 'Site Disclosure Statement' })).toBe(
        true,
      );
    });

    it('returns false for other app types', () => {
      expect(isSdsAppType({ abbrev: 'NOM' })).toBe(false);
      expect(isSdsAppType({ abbrev: 'CSSA' })).toBe(false);
      expect(isSdsAppType(null)).toBe(false);
    });
  });

  describe('getApplicationActionItems', () => {
    it('returns disclosure action and Export PDF for SDS', () => {
      expect(getApplicationActionItems({ abbrev: 'SDS' })).toEqual([
        {
          label: 'Add Disclosures to Site Registry',
          value: ApplicationAction.ADD_DISCLOSURES_TO_SITE_REGISTRY,
        },
        {
          label: 'Export PDF',
          value: ApplicationAction.EXPORT_PDF,
        },
      ]);
    });

    it('returns notation action and Export PDF for non-SDS forms', () => {
      expect(getApplicationActionItems({ abbrev: 'NOM' })).toEqual([
        {
          label: 'Add Notation to Site Registry',
          value: ApplicationAction.ADD_NOTATION_TO_SITE_REGISTRY,
        },
        {
          label: 'Export PDF',
          value: ApplicationAction.EXPORT_PDF,
        },
      ]);
      expect(getApplicationActionItems(undefined)).toEqual([
        {
          label: 'Add Notation to Site Registry',
          value: ApplicationAction.ADD_NOTATION_TO_SITE_REGISTRY,
        },
        {
          label: 'Export PDF',
          value: ApplicationAction.EXPORT_PDF,
        },
      ]);
    });
  });

  describe('getSiteRegistryTabForAction', () => {
    it('maps notation action to notations tab', () => {
      expect(
        getSiteRegistryTabForAction(
          ApplicationAction.ADD_NOTATION_TO_SITE_REGISTRY,
        ),
      ).toBe('notations');
    });

    it('maps disclosure action to disclosure tab', () => {
      expect(
        getSiteRegistryTabForAction(
          ApplicationAction.ADD_DISCLOSURES_TO_SITE_REGISTRY,
        ),
      ).toBe('disclosure');
    });

    it('returns null for unknown actions', () => {
      expect(getSiteRegistryTabForAction('UNKNOWN')).toBeNull();
    });

    it('returns null for Export PDF', () => {
      expect(
        getSiteRegistryTabForAction(ApplicationAction.EXPORT_PDF),
      ).toBeNull();
    });
  });

  describe('buildApplicationExportPdfTitle', () => {
    it('uses Application ID and form name', () => {
      expect(
        buildApplicationExportPdfTitle(1364, 'Site Risk Classification Report'),
      ).toBe('Application ID 1364 - Site Risk Classification Report');
    });

    it('omits the form name when it is missing', () => {
      expect(buildApplicationExportPdfTitle(1364, null)).toBe(
        'Application ID 1364',
      );
      expect(buildApplicationExportPdfTitle(' 12 ', '   ')).toBe(
        'Application ID 12',
      );
    });

    it('strips characters that cannot appear in a file name', () => {
      expect(buildApplicationExportPdfTitle(1, 'Site/Risk: "Report"|A')).toBe(
        'Application ID 1 - Site Risk Report A',
      );
    });
  });

  describe('printApplicationFormAsPdf', () => {
    it('sets document.title for Save as PDF and restores it after print', () => {
      const expectedTitle =
        'Application ID 1364 - Site Risk Classification Report';
      const previousTitle = document.title;
      const print = vi.spyOn(window, 'print').mockImplementation(() => {
        expect(document.title).toBe(expectedTitle);
        window.dispatchEvent(new Event('afterprint'));
      });

      printApplicationFormAsPdf(expectedTitle);

      expect(print).toHaveBeenCalledOnce();
      expect(document.title).toBe(previousTitle);

      print.mockRestore();
    });
  });

  describe('buildSiteRegistryEditTabUrl', () => {
    it('builds a notations edit deep link with applicationId', () => {
      vi.stubEnv('VITE_SITE_REGISTRY_URL', 'https://registry.test/');

      expect(
        buildSiteRegistryEditTabUrl({
          siteId: 99,
          tab: 'notations',
          applicationId: 42,
        }),
      ).toBe(
        'https://registry.test/site/details/99/notations?edit&applicationId=42',
      );
    });

    it('builds a disclosure edit deep link', () => {
      vi.stubEnv('VITE_SITE_REGISTRY_URL', 'https://registry.test');

      expect(
        buildSiteRegistryEditTabUrl({
          siteId: 'SITE-1',
          tab: 'disclosure',
        }),
      ).toBe('https://registry.test/site/details/SITE-1/disclosure?edit');
    });

    it('returns null when base URL or siteId is missing', () => {
      vi.stubEnv('VITE_SITE_REGISTRY_URL', '');

      expect(
        buildSiteRegistryEditTabUrl({
          siteId: 1,
          tab: 'notations',
        }),
      ).toBeNull();

      vi.stubEnv('VITE_SITE_REGISTRY_URL', 'https://registry.test');
      expect(
        buildSiteRegistryEditTabUrl({
          siteId: '',
          tab: 'notations',
        }),
      ).toBeNull();
    });
  });
});
