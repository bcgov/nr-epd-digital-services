import { MigrationInterface, QueryRunner } from 'typeorm';

export class MasterScript1786729599799 implements MigrationInterface {
  name = 'MasterScript1786729599799';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cats"."application_submission" ADD "linked_confirmation_ids" text array`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cats"."application_submission" DROP COLUMN "linked_confirmation_ids"`,
    );
  }
}
