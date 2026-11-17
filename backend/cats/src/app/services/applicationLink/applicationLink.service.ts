import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApplicationLink } from '../../entities/applicationLink.entity';
import { ApplicationSubmission } from '../../entities/applicationSubmission.entity';

export interface ApplicationLinkRow {
  id: string;
  confirmationId: string | null;
  fileName: string | null;
  submittedDate: string | null;
  applicationId: number | null;
  fromForm: boolean;
}

export interface StaffApplicationLink {
  targetApplicationId: number | null;
  confirmationId: string | null;
}

export interface ApplicationLinkSearchHit {
  applicationId: number;
  confirmationId: string | null;
  fileName: string;
}

export function normalizeApplicantConfirmationIds(
  raw: unknown,
  ownConfirmationId: string | null | undefined,
): string[] {
  const values = Array.isArray(raw)
    ? raw
    : typeof raw === 'string'
    ? [raw]
    : [];
  const own = (ownConfirmationId ?? '').trim().toUpperCase();
  const seen = new Set<string>();
  const normalized: string[] = [];

  for (const value of values) {
    if (typeof value !== 'string') {
      continue;
    }
    const code = value.trim().toUpperCase();
    if (!code || code === own || seen.has(code)) {
      continue;
    }
    seen.add(code);
    normalized.push(code);
  }

  return normalized;
}

@Injectable()
export class ApplicationLinkService {
  constructor(
    @InjectRepository(ApplicationLink)
    private readonly linkRepository: Repository<ApplicationLink>,
    @InjectRepository(ApplicationSubmission)
    private readonly submissionRepository: Repository<ApplicationSubmission>,
  ) {}

  async ensureApplicantLinks(
    cssaApplicationId: number,
    confirmationIds: string[],
    user: string,
  ) {
    const existing = await this.linkRepository.find({
      where: { cssaApplicationId },
    });
    const unresolved = new Set(
      existing
        .filter((row) => row.targetApplicationId == null && row.confirmationId)
        .map((row) => row.confirmationId as string),
    );
    const actor = (user || 'SYSTEM').slice(0, 20);
    const now = new Date();

    const linkedTargetIds = new Set(
      existing
        .map((row) => row.targetApplicationId)
        .filter((id): id is number => id != null),
    );

    for (const confirmationId of confirmationIds) {
      const matches = await this.findMatchingApplications(
        cssaApplicationId,
        confirmationId,
      );
      if (matches.length > 0) {
        const unresolvedRows = existing.filter(
          (row) =>
            row.targetApplicationId == null &&
            row.confirmationId === confirmationId,
        );
        for (const row of unresolvedRows) {
          await this.linkRepository.delete(row.id);
        }
        for (const applicationId of matches) {
          if (linkedTargetIds.has(applicationId)) {
            continue;
          }
          await this.linkRepository.save(
            this.linkRepository.create({
              cssaApplicationId,
              targetApplicationId: applicationId,
              confirmationId,
              createdBy: actor,
              updatedBy: actor,
              createdDateTime: now,
              updatedDateTime: now,
            }),
          );
          linkedTargetIds.add(applicationId);
        }
        continue;
      }

      if (unresolved.has(confirmationId)) {
        continue;
      }

      await this.linkRepository.save(
        this.linkRepository.create({
          cssaApplicationId,
          targetApplicationId: null,
          confirmationId,
          createdBy: actor,
          updatedBy: actor,
          createdDateTime: now,
          updatedDateTime: now,
        }),
      );
      unresolved.add(confirmationId);
    }
  }

  async ensureListedConfirmation(
    confirmationId: string | null | undefined,
    user: string,
  ) {
    const [code] = normalizeApplicantConfirmationIds(confirmationId, null);
    if (!code) {
      return;
    }
    const cssaApplicationIds = await this.findCssasListingConfirmation(code);
    for (const cssaApplicationId of cssaApplicationIds) {
      await this.ensureApplicantLinks(cssaApplicationId, [code], user);
    }
  }

  async saveStaffLinks(
    cssaApplicationId: number,
    links: StaffApplicationLink[],
    user: string,
  ) {
    const actor = (user || 'SYSTEM').slice(0, 20);
    const now = new Date();

    await this.linkRepository.manager.transaction(async (manager) => {
      const repo = manager.getRepository(ApplicationLink);
      const existing = await repo.find({
        where: { cssaApplicationId },
      });
      for (const row of existing) {
        await repo.delete(row.id);
      }

      const seenTargets = new Set<number>();
      const seenUnresolved = new Set<string>();
      for (const link of links) {
        if (link.targetApplicationId === cssaApplicationId) {
          continue;
        }
        const confirmationId = normalizeStoredConfirmationId(
          link.confirmationId,
        );
        if (link.targetApplicationId != null) {
          if (seenTargets.has(link.targetApplicationId)) {
            continue;
          }
          seenTargets.add(link.targetApplicationId);
        } else if (!confirmationId || seenUnresolved.has(confirmationId)) {
          continue;
        } else {
          seenUnresolved.add(confirmationId);
        }
        await repo.save(
          repo.create({
            cssaApplicationId,
            targetApplicationId: link.targetApplicationId,
            confirmationId,
            createdBy: actor,
            updatedBy: actor,
            createdDateTime: now,
            updatedDateTime: now,
          }),
        );
      }
    });
  }

  async searchLinkTargets(
    cssaApplicationId: number,
    query: string,
    excludeApplicationIds: number[],
  ): Promise<ApplicationLinkSearchHit[]> {
    const needle = query.trim();
    if (!needle) {
      return [];
    }
    const excludeIds = [
      ...new Set([cssaApplicationId, ...excludeApplicationIds]),
    ];
    const schema = this.submissionRepository.metadata?.schema ?? 'cats';
    const rows: Array<{
      application_id: number;
      chefs_confirmation_id: string | null;
      app_type_description: string;
    }> = await this.submissionRepository.query(
      `SELECT DISTINCT ON (a.id)
          a.id AS application_id,
          s.chefs_confirmation_id,
          t.description AS app_type_description
       FROM "${schema}"."application" a
       JOIN "${schema}"."app_type" t ON t.id = a.app_type_id
       LEFT JOIN "${schema}"."application_submission" s
         ON s.application_id = a.id
       WHERE NOT (a.id = ANY($2::int[]))
         AND (
           CAST(a.id AS text) ILIKE $1 ESCAPE '\\'
           OR COALESCE(s.chefs_confirmation_id, '') ILIKE $1 ESCAPE '\\'
           OR t.description ILIKE $1 ESCAPE '\\'
         )
       ORDER BY a.id,
         CASE
           WHEN COALESCE(s.chefs_confirmation_id, '') ILIKE $1 ESCAPE '\\' THEN 0
           ELSE 1
         END,
         s.chefs_confirmation_id`,
      [`%${escapeLike(needle)}%`, excludeIds],
    );

    const hits: ApplicationLinkSearchHit[] = [];
    const seen = new Set<number>();
    for (const row of rows) {
      const applicationId = Number(row.application_id);
      if (seen.has(applicationId) || excludeIds.includes(applicationId)) {
        continue;
      }
      seen.add(applicationId);
      const confirmationId = normalizeStoredConfirmationId(
        row.chefs_confirmation_id,
      );
      hits.push({
        applicationId,
        confirmationId,
        fileName: this.fileName(confirmationId, {
          applicationId,
          appTypeDescription: row.app_type_description ?? '',
        }),
      });
    }
    return hits;
  }

  async listForCssa(cssaApplicationId: number): Promise<ApplicationLinkRow[]> {
    const [rows, applicantConfirmationIds] = await Promise.all([
      this.linkRepository.find({
        where: { cssaApplicationId },
      }),
      this.loadApplicantConfirmationIds(cssaApplicationId),
    ]);
    const targets = await this.loadTargets(
      rows
        .map((row) => row.targetApplicationId)
        .filter((id): id is number => id != null),
    );
    const targetById = new Map(
      targets.map((target) => [target.applicationId, target]),
    );

    return rows
      .map((row) => {
        const target =
          row.targetApplicationId == null
            ? undefined
            : targetById.get(row.targetApplicationId);
        return {
          id: row.id,
          confirmationId: row.confirmationId,
          fileName: this.fileName(row.confirmationId, target),
          submittedDate: target ? asDateString(target.receivedDate) : null,
          applicationId: row.targetApplicationId,
          fromForm:
            row.confirmationId != null &&
            applicantConfirmationIds.has(row.confirmationId),
        };
      })
      .sort(compareLinkRows);
  }

  private fileName(
    confirmationId: string | null,
    target: { applicationId: number; appTypeDescription: string } | undefined,
  ) {
    if (!target) {
      return confirmationId;
    }
    if (confirmationId) {
      return `${confirmationId} - ${target.appTypeDescription}`;
    }
    return `${target.applicationId} - ${target.appTypeDescription}`;
  }

  private async findMatchingApplications(
    cssaApplicationId: number,
    confirmationId: string,
  ) {
    const schema = this.submissionRepository.metadata?.schema ?? 'cats';
    const rows: Array<{ application_id: number }> =
      await this.submissionRepository.query(
        `SELECT DISTINCT application_id
         FROM "${schema}"."application_submission"
         WHERE application_id IS NOT NULL
           AND application_id <> $1
           AND chefs_confirmation_id IS NOT NULL
           AND upper(trim(chefs_confirmation_id)) = $2`,
        [cssaApplicationId, confirmationId],
      );
    return [...new Set(rows.map((row) => Number(row.application_id)))];
  }

  private async findCssasListingConfirmation(confirmationId: string) {
    const schema = this.submissionRepository.metadata?.schema ?? 'cats';
    const rows: Array<{ application_id: number }> =
      await this.submissionRepository.query(
        `SELECT DISTINCT application_id
         FROM "${schema}"."application_submission"
         WHERE application_id IS NOT NULL
           AND linked_confirmation_ids IS NOT NULL
           AND $1 = ANY(linked_confirmation_ids)`,
        [confirmationId],
      );
    return [...new Set(rows.map((row) => Number(row.application_id)))];
  }

  private async loadApplicantConfirmationIds(cssaApplicationId: number) {
    const schema = this.submissionRepository.metadata?.schema ?? 'cats';
    const rows: Array<{ applicant_confirmation_ids: string[] | null }> =
      await this.submissionRepository.query(
        `SELECT linked_confirmation_ids AS applicant_confirmation_ids
         FROM "${schema}"."application_submission"
         WHERE application_id = $1`,
        [cssaApplicationId],
      );
    return new Set(
      rows.flatMap((row) => row.applicant_confirmation_ids ?? []),
    );
  }

  private async loadTargets(applicationIds: number[]) {
    const ids = [...new Set(applicationIds)];
    if (ids.length === 0) {
      return [];
    }
    const schema = this.submissionRepository.metadata?.schema ?? 'cats';
    const rows: Array<{
      application_id: number;
      received_date: Date | string | null;
      app_type_description: string;
    }> = await this.submissionRepository.query(
      `SELECT a.id AS application_id, a.received_date, t.description AS app_type_description
       FROM "${schema}"."application" a
       JOIN "${schema}"."app_type" t ON t.id = a.app_type_id
       WHERE a.id = ANY($1::int[])`,
      [ids],
    );
    return rows.map((row) => ({
      applicationId: Number(row.application_id),
      receivedDate: row.received_date,
      appTypeDescription: row.app_type_description,
    }));
  }
}

function escapeLike(value: string) {
  return value.replace(/[\\%_]/g, '\\$&');
}

function normalizeStoredConfirmationId(value: string | null | undefined) {
  const code = (value ?? '').trim().toUpperCase();
  return code || null;
}

function asDateString(value: Date | string | null) {
  if (value == null) {
    return null;
  }
  if (typeof value === 'string') {
    return value.slice(0, 10);
  }
  const year = value.getUTCFullYear();
  const month = String(value.getUTCMonth() + 1).padStart(2, '0');
  const day = String(value.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function compareLinkRows(a: ApplicationLinkRow, b: ApplicationLinkRow) {
  if (a.submittedDate == null && b.submittedDate != null) {
    return 1;
  }
  if (a.submittedDate != null && b.submittedDate == null) {
    return -1;
  }
  if (
    a.submittedDate != null &&
    b.submittedDate != null &&
    a.submittedDate !== b.submittedDate
  ) {
    return a.submittedDate < b.submittedDate ? -1 : 1;
  }
  const byConfirmationId = (a.confirmationId ?? '').localeCompare(
    b.confirmationId ?? '',
  );
  if (byConfirmationId !== 0) {
    return byConfirmationId;
  }
  return (a.applicationId ?? 0) - (b.applicationId ?? 0);
}
