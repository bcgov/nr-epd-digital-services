import { MigrationInterface, QueryRunner } from 'typeorm';

export class masterScript1748473521366 implements MigrationInterface {
  name = 'masterScript1748473521366';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cats"."application_service_type" ALTER COLUMN "assignment_factor" TYPE numeric(9,5)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cats"."application_service_type" ALTER COLUMN "assignment_factor" TYPE numeric(3,5)`,
    );
  }
}
