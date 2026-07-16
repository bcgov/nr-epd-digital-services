import { MigrationInterface, QueryRunner } from 'typeorm';

export class MasterScript1783550851129 implements MigrationInterface {
  name = 'MasterScript1783550851129';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cats"."application_service_type" RENAME COLUMN "service_fee" TO "service_fee_in_cents"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cats"."application_service_type" RENAME COLUMN "service_fee_in_cents" TO "service_fee"`,
    );
  }
}
