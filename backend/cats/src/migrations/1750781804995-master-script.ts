import { MigrationInterface, QueryRunner } from 'typeorm';

export class masterScript1750781804995 implements MigrationInterface {
  name = 'masterScript1750781804995';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_v2" ADD "pstExempt" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_v2" DROP COLUMN "pstExempt"`,
    );
  }
}
