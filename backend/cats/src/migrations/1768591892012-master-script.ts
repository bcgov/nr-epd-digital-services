import { MigrationInterface, QueryRunner } from 'typeorm';

export class MasterScript1768591892012 implements MigrationInterface {
  name = 'MasterScript1768591892012';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cats"."application" ADD "application_specific_data" jsonb`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cats"."application" DROP COLUMN "application_specific_data"`,
    );
  }
}
