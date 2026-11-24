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

/**
 * Written before the SITE call. If that call commits and the last-push update
 * does not, this is what a later duplicate is matched against.
 */
export const SDS_DISCLOSURE_PUSH_ATTEMPT_KEY = 'sdsDisclosurePushAttempt';

export type SdsDisclosurePushAttempt = {
  siteId: number;
  dateCompleted: string;
  attemptedAt: string;
};

export const readSdsDisclosurePushAttempt = (
  applicationSpecificData: Record<string, any> | null | undefined,
): SdsDisclosurePushAttempt | null => {
  const value = applicationSpecificData?.[SDS_DISCLOSURE_PUSH_ATTEMPT_KEY];
  if (
    !value ||
    typeof value.attemptedAt !== 'string' ||
    typeof value.dateCompleted !== 'string' ||
    typeof value.siteId !== 'number'
  ) {
    return null;
  }

  return {
    siteId: value.siteId,
    dateCompleted: value.dateCompleted,
    attemptedAt: value.attemptedAt,
  };
};

export const withSdsDisclosurePushAttempt = (
  applicationSpecificData: Record<string, any> | null | undefined,
  attempt: SdsDisclosurePushAttempt,
): Record<string, any> => ({
  ...(applicationSpecificData ?? {}),
  [SDS_DISCLOSURE_PUSH_ATTEMPT_KEY]: attempt,
});

export const withoutSdsDisclosurePushAttempt = (
  applicationSpecificData: Record<string, any> | null | undefined,
): Record<string, any> => {
  if (!applicationSpecificData) {
    return {};
  }

  const next = { ...applicationSpecificData };
  delete next[SDS_DISCLOSURE_PUSH_ATTEMPT_KEY];
  return next;
};

export const isSameSdsDisclosurePushAttempt = (
  attempt: SdsDisclosurePushAttempt | null,
  siteId: number,
  dateCompleted: string,
): boolean =>
  attempt?.siteId === siteId && attempt.dateCompleted === dateCompleted;
