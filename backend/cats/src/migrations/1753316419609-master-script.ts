import { MigrationInterface, QueryRunner } from 'typeorm';

export class masterScript1753316419609 implements MigrationInterface {
  name = 'masterScript1753316419609';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_v2" DROP CONSTRAINT "FK_d1da0b1a75a7a398299e9358f21"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_v2" DROP CONSTRAINT "FK_dcb348f9d985f89f8f67b9064e5"`,
    );
    await queryRunner.query(
      `CREATE TYPE "cats"."invoice_item_item_type_enum" AS ENUM('service', 'expense', 'timesheet')`,
    );
    await queryRunner.query(
      `CREATE TABLE "cats"."invoice_item" ("id" SERIAL NOT NULL, "invoice_id" integer NOT NULL, "item_type" "cats"."invoice_item_item_type_enum" NOT NULL, "description" character varying(255) NOT NULL, "quantity" integer NOT NULL, "unit_price_in_cents" integer NOT NULL, "total_in_cents" integer NOT NULL, "who_created" character varying(30) NOT NULL, "who_updated" character varying(30), "when_created" TIMESTAMP NOT NULL DEFAULT now(), "when_updated" TIMESTAMP DEFAULT now(), CONSTRAINT "PK_621317346abdf61295516f3cb76" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_invoice_item_when_created" ON "cats"."invoice_item" ("when_created") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_invoice_item_type" ON "cats"."invoice_item" ("item_type") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_invoice_item_invoice_id" ON "cats"."invoice_item" ("invoice_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "invoice_item_pkey" ON "cats"."invoice_item" ("id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_attachment" DROP COLUMN "updated_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_attachment" DROP COLUMN "created_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_attachment" DROP COLUMN "object_storage_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_attachment" DROP COLUMN "created_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_attachment" DROP COLUMN "updated_by"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_v2" DROP COLUMN "invoiceId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_v2" DROP COLUMN "issuedDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_v2" DROP COLUMN "dueDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_v2" DROP COLUMN "status"`,
    );
    await queryRunner.query(`DROP TYPE "cats"."invoice_v2_status_enum"`);
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_v2" DROP COLUMN "taxExempt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_v2" DROP COLUMN "subtotalInCents"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_v2" DROP COLUMN "gstInCents"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_v2" DROP COLUMN "pstInCents"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_v2" DROP COLUMN "totalInCents"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_v2" DROP COLUMN "applicationId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_v2" DROP COLUMN "recipientId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_v2" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_v2" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_v2" DROP COLUMN "pstExempt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_v2" DROP COLUMN "notes"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_v2" DROP COLUMN "createdBy"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_v2" DROP COLUMN "updatedBy"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_attachment" ADD "object_id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_attachment" ADD "who_created" character varying(30) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_attachment" ADD "who_updated" character varying(30)`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_attachment" ADD "when_created" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_attachment" ADD "when_updated" TIMESTAMP DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_v2" ADD "application_id" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_v2" ADD "person_id" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_v2" ADD "issued_date" TIMESTAMP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_v2" ADD "due_date" TIMESTAMP NOT NULL`,
    );
    await queryRunner.query(
      `CREATE TYPE "cats"."invoice_v2_invoice_status_enum" AS ENUM('draft', 'sent', 'received', 'paid')`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_v2" ADD "invoice_status" "cats"."invoice_v2_invoice_status_enum" NOT NULL DEFAULT 'draft'`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_v2" ADD "tax_exempt" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_v2" ADD "pst_exempt" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_v2" ADD "subtotal_in_cents" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_v2" ADD "gst_in_cents" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_v2" ADD "pst_in_cents" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_v2" ADD "total_in_cents" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_v2" ADD "invoice_notes" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_v2" ADD "who_created" character varying(30) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_v2" ADD "who_updated" character varying(30)`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_v2" ADD "when_created" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_v2" ADD "when_updated" TIMESTAMP DEFAULT now()`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_invoice_attachment_when_created" ON "cats"."invoice_attachment" ("when_created") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_invoice_attachment_invoice_id" ON "cats"."invoice_attachment" ("invoice_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_invoice_v2_when_created" ON "cats"."invoice_v2" ("when_created") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_invoice_v2_person_id" ON "cats"."invoice_v2" ("person_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_invoice_v2_application_id" ON "cats"."invoice_v2" ("application_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_item" ADD CONSTRAINT "FK_9830c1881dd701d440c2164c3cd" FOREIGN KEY ("invoice_id") REFERENCES "cats"."invoice_v2"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_v2" ADD CONSTRAINT "FK_178a4e7d608c4ee2e992d1ab555" FOREIGN KEY ("application_id") REFERENCES "cats"."application"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_v2" ADD CONSTRAINT "FK_9e2a3ba292ed932824921e5ef22" FOREIGN KEY ("person_id") REFERENCES "cats"."person"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_v2" DROP CONSTRAINT "FK_9e2a3ba292ed932824921e5ef22"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_v2" DROP CONSTRAINT "FK_178a4e7d608c4ee2e992d1ab555"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_item" DROP CONSTRAINT "FK_9830c1881dd701d440c2164c3cd"`,
    );
    await queryRunner.query(
      `DROP INDEX "cats"."idx_invoice_v2_application_id"`,
    );
    await queryRunner.query(`DROP INDEX "cats"."idx_invoice_v2_person_id"`);
    await queryRunner.query(`DROP INDEX "cats"."idx_invoice_v2_when_created"`);
    await queryRunner.query(
      `DROP INDEX "cats"."idx_invoice_attachment_invoice_id"`,
    );
    await queryRunner.query(
      `DROP INDEX "cats"."idx_invoice_attachment_when_created"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_v2" DROP COLUMN "when_updated"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_v2" DROP COLUMN "when_created"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_v2" DROP COLUMN "who_updated"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_v2" DROP COLUMN "who_created"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_v2" DROP COLUMN "invoice_notes"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_v2" DROP COLUMN "total_in_cents"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_v2" DROP COLUMN "pst_in_cents"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_v2" DROP COLUMN "gst_in_cents"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_v2" DROP COLUMN "subtotal_in_cents"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_v2" DROP COLUMN "pst_exempt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_v2" DROP COLUMN "tax_exempt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_v2" DROP COLUMN "invoice_status"`,
    );
    await queryRunner.query(
      `DROP TYPE "cats"."invoice_v2_invoice_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_v2" DROP COLUMN "due_date"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_v2" DROP COLUMN "issued_date"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_v2" DROP COLUMN "person_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_v2" DROP COLUMN "application_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_attachment" DROP COLUMN "when_updated"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_attachment" DROP COLUMN "when_created"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_attachment" DROP COLUMN "who_updated"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_attachment" DROP COLUMN "who_created"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_attachment" DROP COLUMN "object_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_v2" ADD "updatedBy" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_v2" ADD "createdBy" character varying`,
    );
    await queryRunner.query(`ALTER TABLE "cats"."invoice_v2" ADD "notes" text`);
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_v2" ADD "pstExempt" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_v2" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_v2" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_v2" ADD "recipientId" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_v2" ADD "applicationId" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_v2" ADD "totalInCents" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_v2" ADD "pstInCents" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_v2" ADD "gstInCents" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_v2" ADD "subtotalInCents" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_v2" ADD "taxExempt" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `CREATE TYPE "cats"."invoice_v2_status_enum" AS ENUM('draft', 'sent', 'received', 'paid')`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_v2" ADD "status" "cats"."invoice_v2_status_enum" NOT NULL DEFAULT 'draft'`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_v2" ADD "dueDate" TIMESTAMP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_v2" ADD "issuedDate" TIMESTAMP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_v2" ADD "invoiceId" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_attachment" ADD "updated_by" character varying(100)`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_attachment" ADD "created_by" character varying(100) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_attachment" ADD "object_storage_id" character varying(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_attachment" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_attachment" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`DROP INDEX "cats"."invoice_item_pkey"`);
    await queryRunner.query(`DROP INDEX "cats"."idx_invoice_item_invoice_id"`);
    await queryRunner.query(`DROP INDEX "cats"."idx_invoice_item_type"`);
    await queryRunner.query(
      `DROP INDEX "cats"."idx_invoice_item_when_created"`,
    );
    await queryRunner.query(`DROP TABLE "cats"."invoice_item"`);
    await queryRunner.query(`DROP TYPE "cats"."invoice_item_item_type_enum"`);
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_v2" ADD CONSTRAINT "FK_dcb348f9d985f89f8f67b9064e5" FOREIGN KEY ("applicationId") REFERENCES "cats"."application"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_v2" ADD CONSTRAINT "FK_d1da0b1a75a7a398299e9358f21" FOREIGN KEY ("recipientId") REFERENCES "cats"."person"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
