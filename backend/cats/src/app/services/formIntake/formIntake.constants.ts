export interface FormConfig {
  appTypeAbbrev: string;
  siteIdField: string;
  apiKeyEnvKey: string;
}

export const FORM_REGISTRY: Record<string, FormConfig> = {
  CSR: {
    appTypeAbbrev: 'CSR',
    siteIdField: '7-siteIdIncludeAllRelatedNumbers',
    apiKeyEnvKey: 'CSSA_FORM_API_KEY',
  },
};

export const FORM_NAME_TO_APP_TYPE: Record<string, string> = {
  'Contaminated Site Services Application': 'CSR',
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
