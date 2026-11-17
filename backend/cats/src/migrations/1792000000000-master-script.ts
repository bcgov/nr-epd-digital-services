import { MigrationInterface, QueryRunner } from 'typeorm';

export class MasterScript1792000000000 implements MigrationInterface {
  name = 'MasterScript1792000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "cats"."application_link" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "cssa_application_id" integer NOT NULL, "target_application_id" integer, "confirmation_id" character varying, "created_by" character varying(20) NOT NULL, "created_date_time" TIMESTAMP NOT NULL, "updated_by" character varying(20) NOT NULL, "updated_date_time" TIMESTAMP NOT NULL, CONSTRAINT "PK_application_link" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_application_link_cssa_application_id" ON "cats"."application_link" ("cssa_application_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "pk_application_link" ON "cats"."application_link" ("id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "uq_application_link_unresolved_confirmation" ON "cats"."application_link" ("cssa_application_id", "confirmation_id") WHERE "target_application_id" IS NULL AND "confirmation_id" IS NOT NULL`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "uq_application_link_target" ON "cats"."application_link" ("cssa_application_id", "target_application_id") WHERE "target_application_id" IS NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."application_link" ADD CONSTRAINT "FK_application_link_cssa" FOREIGN KEY ("cssa_application_id") REFERENCES "cats"."application"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."application_link" ADD CONSTRAINT "FK_application_link_target" FOREIGN KEY ("target_application_id") REFERENCES "cats"."application"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cats"."application_link" DROP CONSTRAINT "FK_application_link_target"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."application_link" DROP CONSTRAINT "FK_application_link_cssa"`,
    );
    await queryRunner.query(`DROP INDEX "cats"."uq_application_link_target"`);
    await queryRunner.query(
      `DROP INDEX "cats"."uq_application_link_unresolved_confirmation"`,
    );
    await queryRunner.query(`DROP INDEX "cats"."pk_application_link"`);
    await queryRunner.query(
      `DROP INDEX "cats"."idx_application_link_cssa_application_id"`,
    );
    await queryRunner.query(`DROP TABLE "cats"."application_link"`);
  }
}
