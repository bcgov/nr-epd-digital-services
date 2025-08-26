import { MigrationInterface, QueryRunner } from 'typeorm';

export class masterScript1739126886945 implements MigrationInterface {
  name = 'masterScript1739126886945';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cats"."person" RENAME COLUMN "ts" TO "is_deleted"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."person" DROP COLUMN "is_deleted"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."person" ADD "is_deleted" boolean`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cats"."person" DROP COLUMN "is_deleted"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."person" ADD "is_deleted" bytea`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."person" RENAME COLUMN "is_deleted" TO "ts"`,
    );
  }
}
