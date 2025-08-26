import { MigrationInterface, QueryRunner } from 'typeorm';

export class masterScript1739939250557 implements MigrationInterface {
  name = 'masterScript1739939250557';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "cats"."uidx_app_status_is_current_application_id"`,
    );

    await queryRunner.query(`
            ALTER TABLE "cats"."app_status"
            DROP CONSTRAINT "REL_33e54882e3e4e9145299f480de";
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE  "cats"."app_status"
            ADD CONSTRAINT "REL_33e54882e3e4e9145299f480de" UNIQUE ("application_id");
        `);

    await queryRunner.query(
      `CREATE UNIQUE INDEX "uidx_app_status_is_current_application_id" ON "cats"."app_status" ("application_id") `,
    );
  }
}
