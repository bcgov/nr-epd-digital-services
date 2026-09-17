import {
  Schedule2Reference,
  resolveSchedule2Reference,
} from './sdsSchedule2Catalogue';

/**
 * SITE-shaped projection of an SDS application.
 *
 * Field names mirror SITE's disclosure payload (`SiteDisclosureServiceInputDto`
 * plus `siteRegDateEntered`) so the same mapper can drive both the read-only
 * preview and the future push. Everything CATS is not responsible for (owners,
 * PIDs/PINs, coordinates, signature, qualifying questions) is deliberately
 * absent.
 */
export type SdsDisclosure = {
  siteRegDateRecd: string | null;
  dateCompleted: string | null;
  localAuthDateRecd: string | null;
  rwmDateDecision: string | null;
  siteRegDateEntered: string | null;
  schedule2References: Schedule2Reference[];
  plannedActivityComment: string | null;
  siteDisclosureComment: string | null;
  govDocumentsComment: string | null;
};

const CHEFS_KEYS = {
  plannedActivity: 'Section4-BriefProposedLandUseSummary',
  informationUsed: 'Section4-InformationUsedForSDS',
  governmentOrders: 'Section4-PastPresentGovernmentOrders',
  schedule2: 'schedule2Reference',
  signed: 'datesigned',
  approvingAuthorityReceived: 'datereceivedbyapprovingauthority',
  registrarSubmitted: 'datesubmittedtoregistrar',
} as const;

/**
 * Depth-first lookup of the first value for a key.
 *
 * CHEFS submission data is nested differently by section — most SDS fields sit
 * under `container`, while `approvingAuthorityContactInformation` is a sibling
 * of it — so the mapper searches the whole tree rather than assuming a shape.
 */
const findFirst = (value: unknown, key: string): unknown => {
  if (value == null || typeof value !== 'object') {
    return undefined;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findFirst(item, key);
      if (found !== undefined) {
        return found;
      }
    }
    return undefined;
  }

  const record = value as Record<string, unknown>;
  if (key in record) {
    return record[key];
  }

  for (const nested of Object.values(record)) {
    const found = findFirst(nested, key);
    if (found !== undefined) {
      return found;
    }
  }

  return undefined;
};

const asText = (value: unknown): string | null => {
  if (value == null) {
    return null;
  }

  const text = String(value).trim();
  return text.length ? text : null;
};

const asDate = (value: unknown): string | null => {
  if (value == null) {
    return null;
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime())
      ? null
      : value.toISOString().slice(0, 10);
  }

  const text = String(value).trim();
  if (!text) {
    return null;
  }

  const isoDate = /^(\d{4}-\d{2}-\d{2})/.exec(text);
  if (isoDate) {
    return isoDate[1];
  }

  const parsed = new Date(text);
  return Number.isNaN(parsed.getTime())
    ? text
    : parsed.toISOString().slice(0, 10);
};

const asArray = (value: unknown): unknown[] => {
  if (value == null || value === '') {
    return [];
  }
  return Array.isArray(value) ? value : [value];
};

const mapSchedule2 = (value: unknown): Schedule2Reference[] => {
  const seen = new Set<string>();
  const rows: Schedule2Reference[] = [];

  for (const item of asArray(value)) {
    const row = resolveSchedule2Reference(item);
    if (!row || seen.has(row.code)) {
      continue;
    }
    seen.add(row.code);
    rows.push(row);
  }

  return rows;
};

/**
 * Project a CHEFS SDS submission onto SITE's disclosure field set.
 *
 * Missing dates stay `null` (the preview must never invent "today"); only the
 * push may fill `dateCompleted` at send time. `none` in the Schedule 2
 * multi-select yields zero rows.
 */
export const mapSdsToSiteDisclosure = (
  submissionData: unknown,
): SdsDisclosure => {
  const approvingAuthorityReceived = asDate(
    findFirst(submissionData, CHEFS_KEYS.approvingAuthorityReceived),
  );

  return {
    siteRegDateRecd: approvingAuthorityReceived,
    dateCompleted: asDate(findFirst(submissionData, CHEFS_KEYS.signed)),
    localAuthDateRecd: approvingAuthorityReceived,
    rwmDateDecision: asDate(
      findFirst(submissionData, CHEFS_KEYS.registrarSubmitted),
    ),
    siteRegDateEntered: null,
    schedule2References: mapSchedule2(
      findFirst(submissionData, CHEFS_KEYS.schedule2),
    ),
    plannedActivityComment: asText(
      findFirst(submissionData, CHEFS_KEYS.plannedActivity),
    ),
    siteDisclosureComment: asText(
      findFirst(submissionData, CHEFS_KEYS.informationUsed),
    ),
    govDocumentsComment: asText(
      findFirst(submissionData, CHEFS_KEYS.governmentOrders),
    ),
  };
};
