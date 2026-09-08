import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Add client-facing (external) status mapping on cats.status_type.
 *
 * Staff dropdown uses internal description + display_order.
 * Submitter status email uses external_description + external_display_order
 * (multiple internals can share one external label / order).
 *
 * External order:
 *  1 Submitted
 *  2 Accepted
 *  3 Additional Information Requested
 *  4 Pending Prepayment
 *  5 Review
 *  6 Completed          (ODM, Invoice — ready-to-invoice stays Completed)
 *  7 Withdrawn
 *  8 Invoice Sent - Awaiting Payment  (Inv. Sent only)
 *  9 Closed
 */
export class StatusTypeExternalMapping1789700000000
  implements MigrationInterface
{
  name = 'StatusTypeExternalMapping1789700000000';

  private readonly mappings: Array<{
    abbrevs: string[];
    externalDescription: string;
    externalDisplayOrder: number;
  }> = [
    {
      abbrevs: ['Received'],
      externalDescription: 'Submitted',
      externalDisplayOrder: 1,
    },
    {
      abbrevs: ['QUE', 'TBA'],
      externalDescription: 'Accepted',
      externalDisplayOrder: 2,
    },
    {
      abbrevs: ['PEND'],
      externalDescription: 'Additional Information Requested',
      externalDisplayOrder: 3,
    },
    {
      abbrevs: ['PEND PP'],
      externalDescription: 'Pending Prepayment',
      externalDisplayOrder: 4,
    },
    {
      abbrevs: ['IP-SRC', 'IP-CW', 'IP-SDM', 'IP-AR', 'REASSIGN'],
      externalDescription: 'Review',
      externalDisplayOrder: 5,
    },
    {
      // Invoice = ready to invoice (may delay before send); keep clients on Completed
      abbrevs: ['ODM', 'Invoice'],
      externalDescription: 'Completed',
      externalDisplayOrder: 6,
    },
    {
      abbrevs: ['WITHDRAWN'],
      externalDescription: 'Withdrawn',
      externalDisplayOrder: 7,
    },
    {
      // Only once the invoice has actually been sent
      abbrevs: ['Inv. Sent'],
      externalDescription: 'Invoice Sent - Awaiting Payment',
      externalDisplayOrder: 8,
    },
    {
      abbrevs: ['Closed'],
      externalDescription: 'Closed',
      externalDisplayOrder: 9,
    },
  ];

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "cats"."status_type"
      ADD COLUMN IF NOT EXISTS "external_description" character varying(250)
    `);
    await queryRunner.query(`
      ALTER TABLE "cats"."status_type"
      ADD COLUMN IF NOT EXISTS "external_display_order" integer
    `);

    for (const mapping of this.mappings) {
      const placeholders = mapping.abbrevs
        .map((_, index) => `$${index + 3}`)
        .join(', ');
      await queryRunner.query(
        `
        UPDATE cats.status_type
        SET
          external_description = $1,
          external_display_order = $2,
          updated_by = 'migration',
          updated_date_time = NOW()
        WHERE abbrev IN (${placeholders})
        `,
        [
          mapping.externalDescription,
          mapping.externalDisplayOrder,
          ...mapping.abbrevs,
        ],
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "cats"."status_type"
      DROP COLUMN IF EXISTS "external_display_order"
    `);
    await queryRunner.query(`
      ALTER TABLE "cats"."status_type"
      DROP COLUMN IF EXISTS "external_description"
    `);
  }
}
