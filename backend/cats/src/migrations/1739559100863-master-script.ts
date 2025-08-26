import { MigrationInterface, QueryRunner } from 'typeorm';

export class masterScript1739559100863 implements MigrationInterface {
  name = 'masterScript1739559100863';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "cats"."person_note" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "person_id" integer NOT NULL, "note_description" text NOT NULL, "created_datetime" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying NOT NULL, "updated_datetime" TIMESTAMP, "updated_by" character varying, "deleted_by" character varying, "deleted_datetime" TIMESTAMP, CONSTRAINT "PK_5f1b2564798b73323b8f972e3d1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "pk_note" ON "cats"."person_note" ("id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."person_note" ADD CONSTRAINT "FK_d1c7a3857d499e44f796a72ca28" FOREIGN KEY ("person_id") REFERENCES "cats"."person"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cats"."person_note" DROP CONSTRAINT "FK_d1c7a3857d499e44f796a72ca28"`,
    );
    await queryRunner.query(`DROP INDEX "cats"."pk_note"`);
    await queryRunner.query(`DROP TABLE "cats"."person_note"`);
  }
}
