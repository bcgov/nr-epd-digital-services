import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Business update: internal "Invoice" (ready to invoice) must stay on
 * external "Completed" until the invoice is actually sent.
 * Only "Inv. Sent" maps to "Invoice Sent - Awaiting Payment".
 */
export class MapInvoiceStatusToCompleted1789800000000
  implements MigrationInterface
{
  name = 'MapInvoiceStatusToCompleted1789800000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
      UPDATE cats.status_type
      SET
        external_description = $1,
        external_display_order = $2,
        updated_by = 'migration',
        updated_date_time = NOW()
      WHERE abbrev = $3
      `,
      ['Completed', 6, 'Invoice'],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
      UPDATE cats.status_type
      SET
        external_description = $1,
        external_display_order = $2,
        updated_by = 'migration',
        updated_date_time = NOW()
      WHERE abbrev = $3
      `,
      ['Invoice Sent - Awaiting Payment', 8, 'Invoice'],
    );
  }
}
