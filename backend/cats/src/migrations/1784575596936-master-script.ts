import { MigrationInterface, QueryRunner } from 'typeorm';

export class MasterScript1784575596936 implements MigrationInterface {
  name = 'MasterScript1784575596936';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "cats"."application_submission" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "application_id" integer, "chefs_form_id" character varying NOT NULL, "chefs_submission_id" character varying NOT NULL, "chefs_form_version_id" character varying, "chefs_confirmation_id" character varying, "form_data" jsonb NOT NULL, "received_at" TIMESTAMP WITH TIME ZONE, "created_by" character varying(20) NOT NULL, "created_date_time" TIMESTAMP NOT NULL, "updated_by" character varying(20) NOT NULL, "updated_date_time" TIMESTAMP NOT NULL, CONSTRAINT "UQ_827feeb338af064230f9f092f4c" UNIQUE ("chefs_submission_id"), CONSTRAINT "PK_bd8b3ad23dd16ccc1bf7d9a27fc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_application_submission_chefs_form_id" ON "cats"."application_submission" ("chefs_form_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_application_submission_application_id" ON "cats"."application_submission" ("application_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "pk_application_submission" ON "cats"."application_submission" ("id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."application_submission" ADD CONSTRAINT "FK_47a5e26fc0f40691a6c3891a0ff" FOREIGN KEY ("application_id") REFERENCES "cats"."application"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cats"."application_submission" DROP CONSTRAINT "FK_47a5e26fc0f40691a6c3891a0ff"`,
    );
    await queryRunner.query(`DROP INDEX "cats"."pk_application_submission"`);
    await queryRunner.query(
      `DROP INDEX "cats"."idx_application_submission_application_id"`,
    );
    await queryRunner.query(
      `DROP INDEX "cats"."idx_application_submission_chefs_form_id"`,
    );
    await queryRunner.query(`DROP TABLE "cats"."application_submission"`);
  }
}
