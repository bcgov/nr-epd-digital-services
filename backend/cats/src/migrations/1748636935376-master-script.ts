import { MigrationInterface, QueryRunner } from 'typeorm';

export class masterScript1748636935376 implements MigrationInterface {
  name = 'masterScript1748636935376';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cats"."participant_role" DROP COLUMN "assignment_factor"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cats"."participant_role" ADD "assignment_factor" integer`,
    );
  }
}
