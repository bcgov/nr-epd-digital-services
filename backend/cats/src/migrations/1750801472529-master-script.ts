import { MigrationInterface, QueryRunner } from 'typeorm';

export class masterScript1750801472529 implements MigrationInterface {
  name = 'masterScript1750801472529';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "cats"."idx_user_id_site_id_application_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."recent_viewed_applications" DROP COLUMN "site_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."recent_viewed_applications" ADD "site_id" integer NOT NULL`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "idx_user_id_site_id_application_id" ON "cats"."recent_viewed_applications" ("user_id", "site_id", "application_id") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "cats"."idx_user_id_site_id_application_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."recent_viewed_applications" DROP COLUMN "site_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."recent_viewed_applications" ADD "site_id" character varying NOT NULL`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "idx_user_id_site_id_application_id" ON "cats"."recent_viewed_applications" ("user_id", "application_id", "site_id") `,
    );
  }
}
