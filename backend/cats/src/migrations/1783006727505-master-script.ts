import { MigrationInterface, QueryRunner } from 'typeorm';

export class MasterScript1783006727505 implements MigrationInterface {
  name = 'MasterScript1783006727505';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_v2" ADD "email_to" jsonb NOT NULL DEFAULT '[]'`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_v2" ADD "email_cc" jsonb NOT NULL DEFAULT '[]'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_v2" DROP COLUMN "email_cc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_v2" DROP COLUMN "email_to"`,
    );
  }
}
