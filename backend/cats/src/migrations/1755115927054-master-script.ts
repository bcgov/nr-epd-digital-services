import { MigrationInterface, QueryRunner } from 'typeorm';

export class masterScript1755115927054 implements MigrationInterface {
  name = 'masterScript1755115927054';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cats"."recent_viewed_applications" ALTER COLUMN "site_id" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cats"."recent_viewed_applications" ALTER COLUMN "site_id" SET NOT NULL`,
    );
  }
}
