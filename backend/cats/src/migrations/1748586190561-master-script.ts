import { MigrationInterface, QueryRunner } from 'typeorm';

export class masterScript1748586190561 implements MigrationInterface {
  name = 'masterScript1748586190561';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cats"."application_service_type" DROP CONSTRAINT "FK_a50be796c81668ff9f17dcb52ed"`,
    );
    await queryRunner.query(
      `CREATE TABLE "cats"."application_service_type_assignment_factor" ("id" SERIAL NOT NULL, "assignment_factor" numeric(9,5) NOT NULL, "service_type_id" integer, "role_id" integer, CONSTRAINT "PK_be9982e7b27f7156cb1f1432302" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."application_service_type" DROP COLUMN "role_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."application_service_type" DROP COLUMN "assignment_factor"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."application_service_type_assignment_factor" ADD CONSTRAINT "FK_638638ad7df9488914a5b759321" FOREIGN KEY ("service_type_id") REFERENCES "cats"."application_service_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."application_service_type_assignment_factor" ADD CONSTRAINT "FK_2c342d1291182a9500fa231ca23" FOREIGN KEY ("role_id") REFERENCES "cats"."participant_role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cats"."application_service_type_assignment_factor" DROP CONSTRAINT "FK_2c342d1291182a9500fa231ca23"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."application_service_type_assignment_factor" DROP CONSTRAINT "FK_638638ad7df9488914a5b759321"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."application_service_type" ADD "assignment_factor" numeric(9,5) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."application_service_type" ADD "role_id" integer`,
    );
    await queryRunner.query(
      `DROP TABLE "cats"."application_service_type_assignment_factor"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."application_service_type" ADD CONSTRAINT "FK_a50be796c81668ff9f17dcb52ed" FOREIGN KEY ("role_id") REFERENCES "cats"."participant_role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
