/** Keep in sync with backend `applicationStatusComment.ts`. */
export const MORE_INFORMATION_STATUS_ABBREV = 'PEND';
export const REJECTION_STATUS_ABBREV = 'WITHDRAWN';

export const COMMENT_REQUIRED_STATUS_ABBREVS = [
  MORE_INFORMATION_STATUS_ABBREV,
  REJECTION_STATUS_ABBREV,
] as const;

export function normalizeStatusAbbrev(abbrev?: string | null): string {
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

export function getStatusReasonModalCopy(abbrev?: string | null): {
  title: string;
  helpText: string;
  confirmLabel: string;
} {
  if (isRejectionStatus(abbrev)) {
    return {
      title: 'Reject application',
      helpText:
        'Provide the reason for rejection. This is sent to the applicant. Rejection can only be done once; the applicant must submit a new application if they wish to reapply.',
      confirmLabel: 'Confirm rejection',
    };
  }

  return {
    title: 'Request More Information',
    helpText:
      'Submitter will be notified via email, please provide a comment to explain what information is missing or needs revision.',
    confirmLabel: 'Send',
  };
}
