import { ConfigService } from '@nestjs/config';

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

export function getAppTypeAbbrevByChefsFormId(
  configService: ConfigService,
  chefsFormId: string,
): string | null {
  for (const formConfig of Object.values(FORM_REGISTRY)) {
    if (
      configService.get<string>(formConfig.chefsFormIdEnvKey) === chefsFormId
    ) {
      return formConfig.appTypeAbbrev;
    }
  }
  return null;
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
