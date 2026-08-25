export interface FormConfig {
  appTypeAbbrev: string;
  displayName: string;
  siteIdField: string;
  apiKeyEnvKey: string;
  chefsFormIdEnvKey: string;
}

export const FORM_REGISTRY: Record<string, FormConfig> = {
  CSR: {
    appTypeAbbrev: 'CSR',
    displayName: 'Contaminated Site Services Application',
    siteIdField: '7-siteIdIncludeAllRelatedNumbers',
    apiKeyEnvKey: 'CSSA_FORM_API_KEY',
    chefsFormIdEnvKey: 'CSSA_FORM_ID',
  },
  NIR: {
    appTypeAbbrev: 'NIR',
    displayName: 'Notice of Independent Remediation',
    siteIdField: '7-siteIdIncludeAllRelatedNumbers',
    apiKeyEnvKey: 'NIR_FORM_API_KEY',
    chefsFormIdEnvKey: 'NIR_FORM_ID',
  },
  NOM: {
    appTypeAbbrev: 'NOM',
    displayName: 'Notice of Likely or Actual Migration',
    siteIdField: '7-siteIdIncludeAllRelatedNumbers',
    apiKeyEnvKey: 'NOM_FORM_API_KEY',
    chefsFormIdEnvKey: 'NOM_FORM_ID',
  },
  SDS: {
    appTypeAbbrev: 'SDS',
    displayName: 'Site Disclosure Statement',
    siteIdField: '7-siteIdIncludeAllRelatedNumbers',
    apiKeyEnvKey: 'SDS_FORM_API_KEY',
    chefsFormIdEnvKey: 'SDS_FORM_ID',
  },
  IR: {
    appTypeAbbrev: 'IR',
    displayName: 'Site Information Request',
    siteIdField: '7-siteIdIncludeAllRelatedNumbers',
    apiKeyEnvKey: 'IR_FORM_API_KEY',
    chefsFormIdEnvKey: 'IR_FORM_ID',
  },
};

export const FORM_NAME_TO_APP_TYPE: Record<string, string> = {
  'Contaminated Site Services Application': 'CSR',
  'Notice of Independent Remediation': 'NIR',
  'Notice of Likely or Actual Migration': 'NOM',
  'Site Disclosure Statement': 'SDS',
  'Site Information Request': 'IR',
};

export function getFormConfigByFormName(formName: string): FormConfig | null {
  const appType = FORM_NAME_TO_APP_TYPE[formName];
  if (!appType) return null;
  return FORM_REGISTRY[appType] ?? null;
}

export function getFormConfigByAppType(
  appTypeAbbrev: string,
): FormConfig | null {
  return FORM_REGISTRY[appTypeAbbrev] ?? null;
}

export function getAvailableForms(): {
  appTypeAbbrev: string;
  displayName: string;
}[] {
  return Object.values(FORM_REGISTRY).map(({ appTypeAbbrev, displayName }) => ({
    appTypeAbbrev,
    displayName,
  }));
}
