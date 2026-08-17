import { MigrationInterface, QueryRunner } from 'typeorm';

export class MasterScript1786742534211 implements MigrationInterface {
  name = 'MasterScript1786742534211';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cats"."application_submission" RENAME COLUMN "chefs_form_version_id" TO "chefs_form_version_number"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cats"."application_submission" RENAME COLUMN "chefs_form_version_number" TO "chefs_form_version_id"`,
    );
  }
}
