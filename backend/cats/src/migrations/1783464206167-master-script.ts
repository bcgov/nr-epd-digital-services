import { MigrationInterface, QueryRunner } from 'typeorm';

export class MasterScript1783464206167 implements MigrationInterface {
  name = 'MasterScript1783464206167';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cats"."application_service_type" ADD "service_fee" integer`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cats"."application_service_type" DROP COLUMN "service_fee"`,
    );
  }
}
