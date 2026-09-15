import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  ApplicationAction,
  buildSiteRegistryEditTabUrl,
  getApplicationActionItems,
  getSiteRegistryTabForAction,
  isSdsAppType,
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
      expect(
        isSdsAppType({ description: 'Site Disclosure Statement' }),
      ).toBe(true);
    });

    it('returns false for other app types', () => {
      expect(isSdsAppType({ abbrev: 'NOM' })).toBe(false);
      expect(isSdsAppType({ abbrev: 'CSSA' })).toBe(false);
      expect(isSdsAppType(null)).toBe(false);
    });
  });

  describe('getApplicationActionItems', () => {
    it('returns only disclosure action for SDS', () => {
      expect(getApplicationActionItems({ abbrev: 'SDS' })).toEqual([
        {
          label: 'Add Disclosures to Site Registry',
          value: ApplicationAction.ADD_DISCLOSURES_TO_SITE_REGISTRY,
        },
      ]);
    });

    it('returns only notation action for non-SDS forms', () => {
      expect(getApplicationActionItems({ abbrev: 'NOM' })).toEqual([
        {
          label: 'Add Notation to Site Registry',
          value: ApplicationAction.ADD_NOTATION_TO_SITE_REGISTRY,
        },
      ]);
      expect(getApplicationActionItems(undefined)).toEqual([
        {
          label: 'Add Notation to Site Registry',
          value: ApplicationAction.ADD_NOTATION_TO_SITE_REGISTRY,
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
