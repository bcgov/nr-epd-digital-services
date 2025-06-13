import { MigrationInterface, QueryRunner } from 'typeorm';

export class masterScript1749589091186 implements MigrationInterface {
  name = 'masterScript1749589091186';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "cats"."permission_service_type" ("id" SERIAL NOT NULL, "permission_id" integer NOT NULL, "service_type_id" integer NOT NULL, CONSTRAINT "PK_5c8fc404688076fea60a508ef48" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "cats"."service_assignment_factor" ("id" SERIAL NOT NULL, "assignment_factor" numeric(9,5) NOT NULL, "service_type_id" integer, "role_id" integer, CONSTRAINT "PK_21967cf2f03660e39b18f5b3eb3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."permission_service_type" ADD CONSTRAINT "FK_233dd2f455f13f34f85d067973d" FOREIGN KEY ("permission_id") REFERENCES "cats"."permissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."permission_service_type" ADD CONSTRAINT "FK_117ebea1ed206c05e7b822eecdf" FOREIGN KEY ("service_type_id") REFERENCES "cats"."application_service_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."service_assignment_factor" ADD CONSTRAINT "FK_61f6df4444215a515782a5b11a1" FOREIGN KEY ("service_type_id") REFERENCES "cats"."application_service_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."service_assignment_factor" ADD CONSTRAINT "FK_8477ba43e09fe193b2b9ec5a173" FOREIGN KEY ("role_id") REFERENCES "cats"."participant_role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cats"."service_assignment_factor" DROP CONSTRAINT "FK_8477ba43e09fe193b2b9ec5a173"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."service_assignment_factor" DROP CONSTRAINT "FK_61f6df4444215a515782a5b11a1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."permission_service_type" DROP CONSTRAINT "FK_117ebea1ed206c05e7b822eecdf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."permission_service_type" DROP CONSTRAINT "FK_233dd2f455f13f34f85d067973d"`,
    );
    await queryRunner.query(`DROP TABLE "cats"."service_assignment_factor"`);
    await queryRunner.query(`DROP TABLE "cats"."permission_service_type"`);
  }
}
