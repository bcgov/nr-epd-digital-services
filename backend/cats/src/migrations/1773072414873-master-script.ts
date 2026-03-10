import { MigrationInterface, QueryRunner } from 'typeorm';

export class MasterScript1773072414873 implements MigrationInterface {
  name = 'MasterScript1773072414873';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "cats"."application_secondary_service_type" ("id" SERIAL NOT NULL, "application_id" integer NOT NULL, "service_type_id" integer NOT NULL, "created_by" character varying(20) NOT NULL, "created_date_time" TIMESTAMP NOT NULL, CONSTRAINT "PK_960dc04799e2913865324a500a1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "uq_app_secondary_service_type" ON "cats"."application_secondary_service_type" ("application_id", "service_type_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_app_secondary_service_type_app_id" ON "cats"."application_secondary_service_type" ("application_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "pk_application_secondary_service_type" ON "cats"."application_secondary_service_type" ("id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."application_secondary_service_type" ADD CONSTRAINT "FK_a9493eddd64655c94ef1cbbdfd6" FOREIGN KEY ("application_id") REFERENCES "cats"."application"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."application_secondary_service_type" ADD CONSTRAINT "FK_5e8e20253ac2e6664e547f1fd48" FOREIGN KEY ("service_type_id") REFERENCES "cats"."application_service_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cats"."application_secondary_service_type" DROP CONSTRAINT "FK_5e8e20253ac2e6664e547f1fd48"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."application_secondary_service_type" DROP CONSTRAINT "FK_a9493eddd64655c94ef1cbbdfd6"`,
    );
    await queryRunner.query(
      `DROP INDEX "cats"."pk_application_secondary_service_type"`,
    );
    await queryRunner.query(
      `DROP INDEX "cats"."idx_app_secondary_service_type_app_id"`,
    );
    await queryRunner.query(
      `DROP INDEX "cats"."uq_app_secondary_service_type"`,
    );
    await queryRunner.query(
      `DROP TABLE "cats"."application_secondary_service_type"`,
    );
  }
}
