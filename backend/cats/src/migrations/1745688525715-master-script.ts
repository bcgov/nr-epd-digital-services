import { MigrationInterface, QueryRunner } from 'typeorm';

export class masterScript1745688525715 implements MigrationInterface {
  name = 'masterScript1745688525715';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cats"."application" ADD "assignment_size" integer`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cats"."application" DROP COLUMN "assignment_size"`,
    );
  }
}
