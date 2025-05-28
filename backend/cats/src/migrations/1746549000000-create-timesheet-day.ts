import { MigrationInterface, QueryRunner } from 'typeorm';

export class createTimesheetDay1746549000000 implements MigrationInterface {
  name = 'createTimesheetDay1746549000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "cats"."timesheet_day" (
        "id" SERIAL NOT NULL,
        "application_id" integer NOT NULL,
        "person_id" integer NOT NULL,
        "date" date NOT NULL,
        "description" character varying(255),
        "hours" numeric(5,2),
        "comment" character varying(4000),
        "row_version_count" integer NOT NULL,
        "created_by" character varying(20) NOT NULL,
        "created_date_time" TIMESTAMP NOT NULL,
        "updated_by" character varying(20) NOT NULL,
        "updated_date_time" TIMESTAMP NOT NULL,
        "ts" bytea NOT NULL,
        CONSTRAINT "PK_timesheet_day" PRIMARY KEY ("id")
      )`);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "pk_timesheet_day" ON "cats"."timesheet_day" ("id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_timesheet_day_application_id" ON "cats"."timesheet_day" ("application_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_timesheet_day_person_id" ON "cats"."timesheet_day" ("person_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."timesheet_day" ADD CONSTRAINT "FK_timesheet_day_application_id" FOREIGN KEY ("application_id") REFERENCES "cats"."application"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."timesheet_day" ADD CONSTRAINT "FK_timesheet_day_person_id" FOREIGN KEY ("person_id") REFERENCES "cats"."person"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cats"."timesheet_day" DROP CONSTRAINT "FK_timesheet_day_person_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."timesheet_day" DROP CONSTRAINT "FK_timesheet_day_application_id"`,
    );
    await queryRunner.query(`DROP INDEX "cats"."idx_timesheet_day_person_id"`);
    await queryRunner.query(
      `DROP INDEX "cats"."idx_timesheet_day_application_id"`,
    );
    await queryRunner.query(`DROP INDEX "cats"."pk_timesheet_day"`);
    await queryRunner.query(`DROP TABLE "cats"."timesheet_day"`);
  }
}
