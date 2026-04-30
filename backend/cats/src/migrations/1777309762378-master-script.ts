import { MigrationInterface, QueryRunner } from 'typeorm';

export class MasterScript1777309762378 implements MigrationInterface {
  name = 'MasterScript1777309762378';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cats"."app_participant" ADD "is_deleted" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."app_participant" ADD "deleted_by" character varying(20)`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."app_participant" ADD "deleted_date_time" TIMESTAMP`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cats"."app_participant" DROP COLUMN "deleted_date_time"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."app_participant" DROP COLUMN "deleted_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."app_participant" DROP COLUMN "is_deleted"`,
    );
  }
}
