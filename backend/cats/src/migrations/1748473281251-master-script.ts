import { MigrationInterface, QueryRunner } from 'typeorm';

export class masterScript1748473281251 implements MigrationInterface {
  name = 'masterScript1748473281251';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cats"."application_service_type" DROP COLUMN "assignment_factor"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."application_service_type" ADD "assignment_factor" numeric(8,5) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cats"."application_service_type" DROP COLUMN "assignment_factor"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."application_service_type" ADD "assignment_factor" integer NOT NULL`,
    );
  }
}
