import { ReactNode } from 'react';

export type NavComponent = {
  label: string;
  value: string;
  path: string;
  component: ReactNode;
};

export type ApplicationNavItem = Omit<NavComponent, 'component'>;

/** Tabs shown for every application type */
const SHARED_TAB_PATHS = new Set([
  'application',
  'participants',
  'notes',
  'associated-files',
]);

/**
 * Master tab list (order matters for CSSA).
 * Linked Applications is a placeholder until implemented.
 * Navigation configuration for the pills - used by NavigationPills component
 */
export const navigationItems: ApplicationNavItem[] = [
  { label: 'Application', value: 'application', path: 'application' },
  { label: 'Details', value: 'details', path: 'details' },
  {
    label: 'Linked Applications',
    value: 'linkedApplications',
    path: 'linked-applications',
  },
  { label: 'Participants', value: 'participants', path: 'participants' },
  { label: 'Timesheets', value: 'timesheets', path: 'timesheets' },
  { label: 'Invoices', value: 'invoices', path: 'invoices' },
  { label: 'Notes', value: 'notes', path: 'notes' },
  {
    label: 'Associated Files',
    value: 'associatedFiles',
    path: 'associated-files',
  },
  { label: 'Housing', value: 'housing', path: 'housing' },
];

/** SIR tab order: Application, Participants, Invoices, Notes, Associated Files */
const SIR_TAB_ORDER = [
  'application',
  'participants',
  'invoices',
  'notes',
  'associated-files',
] as const;

const CSSA_ABBREVS = new Set(['CSSA', 'CSR']);
const CSSA_DESCRIPTIONS = new Set(['Contaminated Site Request']);
/** Form hdnAppType / app_type.abbrev for Site Information Request */
const SIR_ABBREVS = new Set(['IR', 'SIR']);

type AppTypeFields = {
  abbrev?: string | null;
  description?: string | null;
};

/**
 * CSSA detection for tab visibility.
 * Prefer abbrev; fall back to known descriptions. Form-name mapping can replace this later.
 */
export function isCssaAppType(appType?: AppTypeFields | null): boolean {
  if (!appType) {
    return false;
  }

  const abbrev = appType.abbrev?.trim().toUpperCase();
  if (abbrev && CSSA_ABBREVS.has(abbrev)) {
    return true;
  }

  const description = appType.description?.trim();
  if (!description) {
    return false;
  }

  if (CSSA_DESCRIPTIONS.has(description)) {
    return true;
  }

  return description.toUpperCase().startsWith('CSSA');
}

/** SIR (Site Information Request) — abbrev IR from CHEFS hdnAppType */
export function isSirAppType(appType?: AppTypeFields | null): boolean {
  if (!appType) {
    return false;
  }

  const abbrev = appType.abbrev?.trim().toUpperCase();
  if (abbrev && SIR_ABBREVS.has(abbrev)) {
    return true;
  }

  const description = appType.description?.trim().toUpperCase() ?? '';
  return (
    description.includes('SITE INFORMATION REQUEST') ||
    description.startsWith('SIR')
  );
}

export function getApplicationNavigationItems(
  appType?: AppTypeFields | null,
): ApplicationNavItem[] {
  if (isCssaAppType(appType)) {
    return navigationItems;
  }

  if (isSirAppType(appType)) {
    const byPath = new Map(navigationItems.map((item) => [item.path, item]));
    return SIR_TAB_ORDER.map((path) => byPath.get(path)).filter(
      (item): item is ApplicationNavItem => item != null,
    );
  }

  return navigationItems.filter((item) => SHARED_TAB_PATHS.has(item.path));
}

/** True when Invoices tab is allowed (CSSA or SIR) */
export function canAccessInvoicesTab(appType?: AppTypeFields | null): boolean {
  return isCssaAppType(appType) || isSirAppType(appType);
}

export const DEFAULT_APPLICATION_TAB_PATH = 'application';
