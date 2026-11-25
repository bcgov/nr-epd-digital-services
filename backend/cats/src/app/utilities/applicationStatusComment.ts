/** Statuses that require a staff comment/reason before the change is saved. */
export const COMMENT_REQUIRED_STATUS_ABBREVS = ['PEND', 'WITHDRAWN'] as const;

export type CommentRequiredStatusAbbrev =
  (typeof COMMENT_REQUIRED_STATUS_ABBREVS)[number];

/** More information / revision request — repeatable. */
export const MORE_INFORMATION_STATUS_ABBREV = 'PEND';

/** Rejection — allowed once; applicant should submit a new application. */
export const REJECTION_STATUS_ABBREV = 'WITHDRAWN';

export function normalizeStatusAbbrev(
  abbrev?: string | null,
): string {
  return (abbrev ?? '').trim().toUpperCase();
}

export function isCommentRequiredStatus(abbrev?: string | null): boolean {
  const normalized = normalizeStatusAbbrev(abbrev);
  return (COMMENT_REQUIRED_STATUS_ABBREVS as readonly string[]).includes(
    normalized,
  );
}

export function isMoreInformationStatus(abbrev?: string | null): boolean {
  return normalizeStatusAbbrev(abbrev) === MORE_INFORMATION_STATUS_ABBREV;
}

export function isRejectionStatus(abbrev?: string | null): boolean {
  return normalizeStatusAbbrev(abbrev) === REJECTION_STATUS_ABBREV;
}
