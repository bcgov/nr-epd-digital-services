import { MigrationInterface, QueryRunner } from 'typeorm';

export class masterScript1750091334380 implements MigrationInterface {
  name = 'masterScript1750091334380';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "cats"."invoice_v2" ADD "notes" text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_v2" DROP COLUMN "notes"`,
    );
  }
}
