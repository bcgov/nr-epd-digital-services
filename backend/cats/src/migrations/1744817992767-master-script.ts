import { MigrationInterface, QueryRunner } from 'typeorm';

export class masterScript1744817992767 implements MigrationInterface {
  name = 'masterScript1744817992767';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_v2" ADD "createdBy" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_v2" ADD "updatedBy" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_v2" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_v2" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_v2" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_v2" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_v2" DROP COLUMN "updatedBy"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_v2" DROP COLUMN "createdBy"`,
    );
  }
}
