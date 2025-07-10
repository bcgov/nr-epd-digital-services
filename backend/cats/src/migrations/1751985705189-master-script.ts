import { MigrationInterface, QueryRunner } from 'typeorm';

export class masterScript1751985705189 implements MigrationInterface {
  name = 'masterScript1751985705189';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "cats"."invoice_attachment" ("id" SERIAL NOT NULL, "invoice_id" integer NOT NULL, "file_name" character varying(255) NOT NULL, "file_size" integer NOT NULL, "mime_type" character varying(100) NOT NULL, "object_storage_id" character varying(255) NOT NULL, "created_by" character varying(100) NOT NULL, "updated_by" character varying(100), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_3a6a40c4f05af6d591a8161ae44" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_attachment" ADD CONSTRAINT "FK_f750f0705196089999d9cf0dcbf" FOREIGN KEY ("invoice_id") REFERENCES "cats"."invoice_v2"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_attachment" DROP CONSTRAINT "FK_f750f0705196089999d9cf0dcbf"`,
    );
    await queryRunner.query(`DROP TABLE "cats"."invoice_attachment"`);
  }
}
