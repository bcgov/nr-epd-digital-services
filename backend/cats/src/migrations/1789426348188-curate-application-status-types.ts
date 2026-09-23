import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Curate cats.status_type for the Application status dropdown.
 *
 * Keepers (active, with display_order):
 *  1 Received
 *  2 Queued (QUE)
 *  3 Pending: Information Required (PEND)
 *  4 Pending: Prepayment (PEND PP)
 *  5 Review in Progress: Site Risk Classification (IP-SRC)
 *  6 To be Assigned (TBA)
 *  7 Review in Progress: Caseworker (IP-CW)
 *  8 Review in Progress: SDM (IP-SDM)
 *  9 Reassignment Required (REASSIGN) — new
 * 10 Review in Progress: Additional Resources (IP-AR)
 * 11 Outcome Decision Made (ODM)
 * 12 Withdrawn (WITHDRAWN) — new
 * 13 Invoice
 * 14 Invoice Sent - Awaiting Payment (Inv. Sent)
 * 15 Closed
 *
 * All other existing status_type rows are deactivated (not deleted).
 * Matching is by abbrev so this is safe on envs that already have prod data.
 */
export class CurateApplicationStatusTypes1789426348188
  implements MigrationInterface
{
  name = 'CurateApplicationStatusTypes1789426348188';

  private readonly keepers: Array<{
    abbrev: string;
    description: string;
    displayOrder: number;
  }> = [
    { abbrev: 'Received', description: 'Received', displayOrder: 1 },
    { abbrev: 'QUE', description: 'Queued', displayOrder: 2 },
    {
      abbrev: 'PEND',
      description: 'Pending: Information Required',
      displayOrder: 3,
    },
    {
      abbrev: 'PEND PP',
      description: 'Pending: Prepayment',
      displayOrder: 4,
    },
    {
      abbrev: 'IP-SRC',
      description: 'Review in Progress: Site Risk Classification',
      displayOrder: 5,
    },
    { abbrev: 'TBA', description: 'To be Assigned', displayOrder: 6 },
    {
      abbrev: 'IP-CW',
      description: 'Review in Progress: Caseworker',
      displayOrder: 7,
    },
    {
      abbrev: 'IP-SDM',
      description: 'Review in Progress: SDM',
      displayOrder: 8,
    },
    {
      abbrev: 'REASSIGN',
      description: 'Reassignment Required',
      displayOrder: 9,
    },
    {
      abbrev: 'IP-AR',
      description: 'Review in Progress: Additional Resources',
      displayOrder: 10,
    },
    {
      abbrev: 'ODM',
      description: 'Outcome Decision Made',
      displayOrder: 11,
    },
    { abbrev: 'WITHDRAWN', description: 'Withdrawn', displayOrder: 12 },
    { abbrev: 'Invoice', description: 'Invoice', displayOrder: 13 },
    {
      abbrev: 'Inv. Sent',
      description: 'Invoice Sent - Awaiting Payment',
      displayOrder: 14,
    },
    { abbrev: 'Closed', description: 'Closed', displayOrder: 15 },
  ];

  private readonly newAbbrevs = ['REASSIGN', 'WITHDRAWN'];

  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const status of this.keepers) {
      await queryRunner.query(
        `
        INSERT INTO cats.status_type (
          abbrev,
          description,
          is_active,
          display_order,
          row_version_count,
          created_by,
          created_date_time,
          updated_by,
          updated_date_time,
          ts
        )
        SELECT
          $1,
          $2,
          true,
          $3,
          1,
          'migration',
          NOW(),
          'migration',
          NOW(),
          decode('00', 'hex')
        WHERE NOT EXISTS (
          SELECT 1 FROM cats.status_type st WHERE st.abbrev = $1
        )
        `,
        [status.abbrev, status.description, status.displayOrder],
      );

      await queryRunner.query(
        `
        UPDATE cats.status_type
        SET
          description = $2,
          is_active = true,
          display_order = $3,
          updated_by = 'migration',
          updated_date_time = NOW()
        WHERE abbrev = $1
        `,
        [status.abbrev, status.description, status.displayOrder],
      );
    }

    const keeperAbbrevs = this.keepers.map((status) => status.abbrev);
    await queryRunner.query(
      `
      UPDATE cats.status_type
      SET
        is_active = false,
        updated_by = 'migration',
        updated_date_time = NOW()
      WHERE abbrev IS NULL
         OR abbrev NOT IN (${keeperAbbrevs.map((_, i) => `$${i + 1}`).join(', ')})
      `,
      keeperAbbrevs,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Only reverse the two newly introduced statuses. Do not try to restore
    // prior is_active flags for historical rows.
    for (const abbrev of this.newAbbrevs) {
      await queryRunner.query(
        `
        DELETE FROM cats.status_type st
        WHERE st.abbrev = $1
          AND NOT EXISTS (
            SELECT 1 FROM cats.app_status a WHERE a.status_type_id = st.id
          )
        `,
        [abbrev],
      );

      await queryRunner.query(
        `
        UPDATE cats.status_type
        SET
          is_active = false,
          updated_by = 'migration',
          updated_date_time = NOW()
        WHERE abbrev = $1
        `,
        [abbrev],
      );
    }
  }
}
