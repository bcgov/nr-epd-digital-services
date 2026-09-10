import { DropdownItem } from '../../../components/action/IActions';

export enum ApplicationAction {
  ADD_NOTATION_TO_SITE_REGISTRY = 'ADD_NOTATION_TO_SITE_REGISTRY',
  ADD_DISCLOSURES_TO_SITE_REGISTRY = 'ADD_DISCLOSURES_TO_SITE_REGISTRY',
}

/** Site Registry nested tab paths used by deep links. */
export type SiteRegistryTabPath = 'notations' | 'disclosure';

export const applicationActionItems: DropdownItem[] = [
  {
    label: 'Add Notation to Site Registry',
    value: ApplicationAction.ADD_NOTATION_TO_SITE_REGISTRY,
  },
  {
    label: 'Add Disclosures to Site Registry',
    value: ApplicationAction.ADD_DISCLOSURES_TO_SITE_REGISTRY,
  },
];

export const getSiteRegistryBaseUrl = (): string | undefined =>
  import.meta.env.VITE_SITE_REGISTRY_URL ||
  window?._env_?.VITE_SITE_REGISTRY_URL;

export const getSiteRegistryTabForAction = (
  action: string,
): SiteRegistryTabPath | null => {
  switch (action) {
    case ApplicationAction.ADD_NOTATION_TO_SITE_REGISTRY:
      return 'notations';
    case ApplicationAction.ADD_DISCLOSURES_TO_SITE_REGISTRY:
      return 'disclosure';
    default:
      return null;
  }
};

/**
 * Builds a Site Registry deep link that opens a site tab in edit mode.
 * Example: https://site.../site/details/123/notations?edit&applicationId=456
 */
export const buildSiteRegistryEditTabUrl = ({
  siteId,
  tab,
  applicationId,
}: {
  siteId: string | number;
  tab: SiteRegistryTabPath;
  applicationId?: string | number | null;
}): string | null => {
  const baseUrl = getSiteRegistryBaseUrl()?.replace(/\/$/, '');
  if (!baseUrl || siteId === null || siteId === undefined || siteId === '') {
    return null;
  }

  const params = new URLSearchParams();
  // Any presence of `edit` enters edit mode in SITE (see SRS-1727).
  params.append('edit', '');
  if (
    applicationId !== null &&
    applicationId !== undefined &&
    String(applicationId).trim() !== ''
  ) {
    params.set('applicationId', String(applicationId));
  }

  // Prefer `?edit` over `?edit=` for readability; SITE accepts either.
  const query = params.toString().replace(/^edit=(&|$)/, 'edit$1');

  return `${baseUrl}/site/details/${siteId}/${tab}?${query}`;
};
