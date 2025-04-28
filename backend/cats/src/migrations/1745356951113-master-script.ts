import { MigrationInterface, QueryRunner } from 'typeorm';

export class masterScript1745356951113 implements MigrationInterface {
  name = 'masterScript1745356951113';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_line_item" DROP COLUMN "unit_price_in_cents"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_line_item" DROP COLUMN "total_in_cents"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_line_item" ADD "unitPriceInCents" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_line_item" ADD "totalInCents" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_line_item" ADD "createdBy" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_line_item" ADD "updatedBy" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_line_item" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_line_item" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_line_item" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_line_item" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_line_item" DROP COLUMN "updatedBy"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_line_item" DROP COLUMN "createdBy"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_line_item" DROP COLUMN "totalInCents"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_line_item" DROP COLUMN "unitPriceInCents"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_line_item" ADD "total_in_cents" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_line_item" ADD "unit_price_in_cents" integer NOT NULL`,
    );
  }
}
