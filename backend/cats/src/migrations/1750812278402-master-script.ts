import { MigrationInterface, QueryRunner } from 'typeorm';

export class masterScript1750812278402 implements MigrationInterface {
  name = 'masterScript1750812278402';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cats"."app_status" ADD "formsflow_app_id" integer`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cats"."app_status" DROP COLUMN "formsflow_app_id"`,
    );
  }
}
