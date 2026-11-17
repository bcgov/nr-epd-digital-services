import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Allow multiple app_status rows per application (status audit history).
 *
 * - Drops any remaining unique-on-application_id constraints/indexes
 * - Adds a partial unique index so only one row per application can be is_current = true
 */
export class AppStatusHistory1789600000000 implements MigrationInterface {
  name = 'AppStatusHistory1789600000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX IF EXISTS "cats"."uidx_app_status_is_current_application_id"`,
    );

    await queryRunner.query(`
      ALTER TABLE "cats"."app_status"
      DROP CONSTRAINT IF EXISTS "REL_33e54882e3e4e9145299f480de"
    `);

    // Deduplicate current rows if any env has more than one is_current=true
    await queryRunner.query(`
      UPDATE cats.app_status AS older
      SET is_current = false,
          updated_by = 'migration',
          updated_date_time = NOW()
      FROM cats.app_status AS newer
      WHERE older.application_id = newer.application_id
        AND older.is_current = true
        AND newer.is_current = true
        AND older.id < newer.id
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX "uidx_app_status_current_application_id"
      ON "cats"."app_status" ("application_id")
      WHERE "is_current" = true
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX IF EXISTS "cats"."uidx_app_status_current_application_id"`,
    );

    // Restore previous one-row-per-application uniqueness (history would need
    // to be collapsed before this can succeed on data with multiple rows).
    await queryRunner.query(`
      CREATE UNIQUE INDEX "uidx_app_status_is_current_application_id"
      ON "cats"."app_status" ("application_id")
    `);

    await queryRunner.query(`
      ALTER TABLE "cats"."app_status"
      ADD CONSTRAINT "REL_33e54882e3e4e9145299f480de" UNIQUE ("application_id")
    `);
  }
}
