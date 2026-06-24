import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

export interface ChefsSubmissionPayload {
  formId: string;
  submissionId: string;
  /** CHEFS form display name (e.g. "NOM") from API `form.name` */
  formName?: string;
  data: Record<string, unknown>;
}

export interface ChefsSubmissionSummary {
  submissionId: string;
  createdAt: string | null;
  label: string;
}

/** Map CHEFS form.name to CATS hdnAppType / ApplicationType abbrev */
export const CHEFS_FORM_NAME_TO_APP_TYPE: Record<string, string> = {
  NOM: 'NOM',
  SIR: 'IR',
  DERA: 'DERA',
  NIR: 'NIR',
  SRCR: 'SRCR',
  SOSC: 'SOSC',
  CSR: 'CSR',
  CSSA: 'CSR',
};

/**
 * CHEFS GET /submissions/:id returns { submission, version, form }.
 * Field values live on submission.submission.data (Form.io).
 */
export function extractChefsSubmissionFields(
  body: unknown,
): Record<string, unknown> {
  if (!body || typeof body !== 'object') {
    return {};
  }

  const root = body as Record<string, unknown>;
  const submissionRecord = (root.submission ?? root) as Record<string, unknown>;
  const inner = submissionRecord.submission as Record<string, unknown> | undefined;

  if (inner?.data && typeof inner.data === 'object' && inner.data !== null) {
    return { ...(inner.data as Record<string, unknown>) };
  }

  if (
    submissionRecord.data &&
    typeof submissionRecord.data === 'object' &&
    submissionRecord.data !== null
  ) {
    return { ...(submissionRecord.data as Record<string, unknown>) };
  }

  return {};
}

/** Form.io schema shape returned to CATS Application tab. */
export type ChefsFormioSchema = {
  title?: string;
  display?: string;
  type?: string;
  components: unknown[];
};

/**
 * CHEFS GET /forms/:id/version returns a Form with `versions[]`; each version has `schema`.
 */
function pickPublishedVersion(
  versions: unknown,
): Record<string, unknown> | null {
  if (!Array.isArray(versions) || versions.length === 0) {
    return null;
  }

  const records = versions.filter(
    (item): item is Record<string, unknown> =>
      Boolean(item) && typeof item === 'object',
  );

  const published = records.find((v) => v.published === true);
  if (published) {
    return published;
  }

  return records.reduce<Record<string, unknown> | null>((best, current) => {
    const currentVersion = Number(current.version);
    const bestVersion = best ? Number(best.version) : -1;
    if (!Number.isNaN(currentVersion) && currentVersion >= bestVersion) {
      return current;
    }
    return best;
  }, null);
}

function schemaFromRecord(
  record: Record<string, unknown>,
  titleFallback?: string,
): ChefsFormioSchema | null {
  if (!Array.isArray(record.components)) {
    return null;
  }
  return {
    title:
      typeof record.title === 'string'
        ? record.title
        : titleFallback,
    display: typeof record.display === 'string' ? record.display : 'form',
    type: typeof record.type === 'string' ? record.type : 'form',
    components: record.components,
  };
}

export function extractChefsFormSchema(body: unknown): ChefsFormioSchema | null {
  if (!body || typeof body !== 'object') {
    return null;
  }

  const root = body as Record<string, unknown>;
  const titleFallback =
    typeof root.name === 'string' && root.name.trim() !== ''
      ? root.name.trim()
      : undefined;

  const directCandidates: unknown[] = [root.schema, root];

  for (const candidate of directCandidates) {
    if (!candidate || typeof candidate !== 'object') {
      continue;
    }
    const parsed = schemaFromRecord(
      candidate as Record<string, unknown>,
      titleFallback,
    );
    if (parsed) {
      return parsed;
    }
  }

  const publishedVersion = pickPublishedVersion(root.versions);
  if (publishedVersion?.schema && typeof publishedVersion.schema === 'object') {
    const parsed = schemaFromRecord(
      publishedVersion.schema as Record<string, unknown>,
      titleFallback,
    );
    if (parsed) {
      return parsed;
    }
  }

  return null;
}

export function extractChefsFormName(body: unknown): string | undefined {
  if (!body || typeof body !== 'object') {
    return undefined;
  }
  const form = (body as Record<string, unknown>).form;
  if (!form || typeof form !== 'object') {
    return undefined;
  }
  const name = (form as Record<string, unknown>).name;
  return typeof name === 'string' && name.trim() !== '' ? name.trim() : undefined;
}

function readSubmissionId(record: Record<string, unknown>): string | null {
  const direct = record.id ?? record.submissionId;
  if (typeof direct === 'string' && direct.trim() !== '') {
    return direct.trim();
  }

  const formMeta = record.form;
  if (formMeta && typeof formMeta === 'object') {
    const fromForm = (formMeta as Record<string, unknown>).submissionId;
    if (typeof fromForm === 'string' && fromForm.trim() !== '') {
      return fromForm.trim();
    }
  }

  const nested = record.submission;
  if (nested && typeof nested === 'object') {
    const nestedId = (nested as Record<string, unknown>).id;
    if (typeof nestedId === 'string' && nestedId.trim() !== '') {
      return nestedId.trim();
    }
  }
  return null;
}

function readCreatedAt(record: Record<string, unknown>): string | null {
  const formMeta =
    record.form && typeof record.form === 'object'
      ? (record.form as Record<string, unknown>)
      : null;

  const candidates = [
    record.createdAt,
    record.created,
    record.createdDate,
    formMeta?.submittedAt,
    formMeta?.createdAt,
    record.submission &&
      typeof record.submission === 'object' &&
      (record.submission as Record<string, unknown>).createdAt,
  ];
  for (const value of candidates) {
    if (typeof value === 'string' && value.trim() !== '') {
      return value.trim();
    }
  }
  return null;
}

/**
 * Parse CHEFS form export JSON into submission summaries (newest first).
 */
export function parseChefsExportSubmissions(
  body: unknown,
  limit = 10,
): ChefsSubmissionSummary[] {
  let raw: unknown[] = [];
  if (Array.isArray(body)) {
    raw = body;
  } else if (body && typeof body === 'object') {
    const obj = body as Record<string, unknown>;
    const nested = obj.submissions ?? obj.records;
    raw = Array.isArray(nested) ? nested : [];
  }

  const normalized = raw
    .map((record) => {
      if (!record || typeof record !== 'object') {
        return null;
      }
      const submissionId = readSubmissionId(record as Record<string, unknown>);
      if (!submissionId) {
        return null;
      }
      const createdAt = readCreatedAt(record as Record<string, unknown>);
      const label = createdAt
        ? `${createdAt} — ${submissionId.slice(0, 8)}…`
        : submissionId;
      return { submissionId, createdAt, label };
    })
    .filter((item): item is ChefsSubmissionSummary => item !== null);

  normalized.sort((a, b) => {
    const aTime = a.createdAt ? Date.parse(a.createdAt) : 0;
    const bTime = b.createdAt ? Date.parse(b.createdAt) : 0;
    return bTime - aTime;
  });

  const seen = new Set<string>();
  const unique: ChefsSubmissionSummary[] = [];
  for (const item of normalized) {
    if (seen.has(item.submissionId)) {
      continue;
    }
    seen.add(item.submissionId);
    unique.push(item);
    if (unique.length >= limit) {
      break;
    }
  }
  return unique;
}

@Injectable()
export class ChefsService {
  private readonly logger = new Logger(ChefsService.name);

  private get baseUrl(): string {
    return (
      process.env.CHEFS_API_URL ||
      'https://submit.digital.gov.bc.ca/app/api/v1'
    ).replace(/\/$/, '');
  }

  /**
   * Fetch a submission from CHEFS REST API.
   * Auth: Basic — username = formId, password = API key (CHEFS convention).
   */
  async getSubmission(
    chefsFormId: string,
    chefsSubmissionId: string,
    apiKey: string,
  ): Promise<ChefsSubmissionPayload> {
    const url = `${this.baseUrl}/submissions/${chefsSubmissionId}`;

    this.logger.log(`Fetching CHEFS submission ${chefsSubmissionId}`);

    const response = await axios.get(url, {
      auth: {
        username: chefsFormId,
        password: apiKey,
      },
      headers: { Accept: 'application/json' },
    });

    const body = response.data;

    return {
      formId: chefsFormId,
      submissionId: chefsSubmissionId,
      formName: extractChefsFormName(body),
      data: extractChefsSubmissionFields(body),
    };
  }

  /**
   * List recent submissions for a form via CHEFS export API (for prototype UI).
   */
  async listSubmissions(
    chefsFormId: string,
    apiKey: string,
    limit = 10,
  ): Promise<ChefsSubmissionSummary[]> {
    const url = `${this.baseUrl}/forms/${chefsFormId}/export?format=json`;

    this.logger.log(`Listing CHEFS submissions for form ${chefsFormId}`);

    const response = await axios.get(url, {
      auth: {
        username: chefsFormId,
        password: apiKey,
      },
      headers: { Accept: 'application/json' },
    });

    return parseChefsExportSubmissions(response.data, limit);
  }

  /**
   * Fetch published Form.io schema for a CHEFS form.
   * Auth: Basic — username = formId, password = API key.
   */
  async getPublishedFormSchema(
    chefsFormId: string,
    apiKey: string,
  ): Promise<ChefsFormioSchema> {
    const url = `${this.baseUrl}/forms/${chefsFormId}/version`;

    this.logger.log(`Fetching CHEFS published form schema for ${chefsFormId}`);

    const response = await axios.get(url, {
      auth: {
        username: chefsFormId,
        password: apiKey,
      },
      headers: { Accept: 'application/json' },
    });

    const schema = extractChefsFormSchema(response.data);
    if (!schema) {
      throw new Error('CHEFS form schema missing components in API response');
    }

    return schema;
  }
}
