import { MigrationInterface, QueryRunner } from 'typeorm';

export class MasterScript1786647182004 implements MigrationInterface {
  name = 'MasterScript1786647182004';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cats"."app_note" ADD "chefs_note_id" character varying`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "uq_app_note_chefs_note_id" ON "cats"."app_note" ("chefs_note_id") WHERE "chefs_note_id" IS NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "cats"."uq_app_note_chefs_note_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."app_note" DROP COLUMN "chefs_note_id"`,
    );
  }
}
