/**
 * Last-push audit for the SDS → SITE disclosure feature.
 *
 * Stored under the application's existing `application_specific_data` JSON so
 * the feature needs no new table and never clobbers unrelated keys.
 */
export const SDS_DISCLOSURE_LAST_PUSH_KEY = 'sdsDisclosureLastPush';

export type SdsDisclosureLastPush = {
  siteId: number;
  lastPushedAt: string;
};

export const readSdsDisclosureLastPush = (
  applicationSpecificData: Record<string, any> | null | undefined,
): SdsDisclosureLastPush | null => {
  const value = applicationSpecificData?.[SDS_DISCLOSURE_LAST_PUSH_KEY];
  if (
    !value ||
    typeof value.lastPushedAt !== 'string' ||
    typeof value.siteId !== 'number'
  ) {
    return null;
  }

  return { siteId: value.siteId, lastPushedAt: value.lastPushedAt };
};

export const withSdsDisclosureLastPush = (
  applicationSpecificData: Record<string, any> | null | undefined,
  lastPush: SdsDisclosureLastPush,
): Record<string, any> => ({
  ...(applicationSpecificData ?? {}),
  [SDS_DISCLOSURE_LAST_PUSH_KEY]: lastPush,
});
