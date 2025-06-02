import { MigrationInterface, QueryRunner } from 'typeorm';

export class masterScript1744316743872 implements MigrationInterface {
  name = 'masterScript1744316743872';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "cats"."invoice_line_item_type_enum" AS ENUM('service', 'expense', 'timesheet')`,
    );
    await queryRunner.query(
      `CREATE TABLE "cats"."invoice_line_item" ("id" SERIAL NOT NULL, "type" "cats"."invoice_line_item_type_enum" NOT NULL, "description" character varying NOT NULL, "quantity" integer NOT NULL, "unit_price_in_cents" integer NOT NULL, "total_in_cents" integer NOT NULL, "invoiceId" integer, CONSTRAINT "PK_4ffb12a7ac2bb69aa7234f30b85" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "cats"."invoice_v2_status_enum" AS ENUM('draft', 'sent', 'received', 'paid')`,
    );
    await queryRunner.query(
      `CREATE TABLE "cats"."invoice_v2" ("id" SERIAL NOT NULL, "invoiceId" integer, "subject" character varying(255) NOT NULL, "issuedDate" TIMESTAMP NOT NULL, "dueDate" TIMESTAMP NOT NULL, "status" "cats"."invoice_v2_status_enum" NOT NULL DEFAULT 'draft', "taxExempt" boolean NOT NULL DEFAULT false, "subtotalInCents" integer NOT NULL, "gstInCents" integer NOT NULL, "pstInCents" integer NOT NULL, "totalInCents" integer NOT NULL, "applicationId" integer, "recipientId" integer, CONSTRAINT "PK_0b39a8aa6bb2881c956cd4b8228" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_line_item" ADD CONSTRAINT "FK_b09242561f9c47a3288dc66c186" FOREIGN KEY ("invoiceId") REFERENCES "cats"."invoice_v2"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_v2" ADD CONSTRAINT "FK_dcb348f9d985f89f8f67b9064e5" FOREIGN KEY ("applicationId") REFERENCES "cats"."application"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_v2" ADD CONSTRAINT "FK_d1da0b1a75a7a398299e9358f21" FOREIGN KEY ("recipientId") REFERENCES "cats"."person"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_v2" DROP CONSTRAINT "FK_d1da0b1a75a7a398299e9358f21"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_v2" DROP CONSTRAINT "FK_dcb348f9d985f89f8f67b9064e5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_line_item" DROP CONSTRAINT "FK_b09242561f9c47a3288dc66c186"`,
    );
    await queryRunner.query(`DROP TABLE "cats"."invoice_v2"`);
    await queryRunner.query(`DROP TYPE "cats"."invoice_v2_status_enum"`);
    await queryRunner.query(`DROP TABLE "cats"."invoice_line_item"`);
    await queryRunner.query(`DROP TYPE "cats"."invoice_line_item_type_enum"`);
  }
}
