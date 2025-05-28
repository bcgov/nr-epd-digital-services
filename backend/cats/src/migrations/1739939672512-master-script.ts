import { MigrationInterface, QueryRunner } from 'typeorm';

export class masterScript1739939672512 implements MigrationInterface {
  name = 'masterScript1739939672512';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "cats"."uidx_application_id_participant_role_id"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE UNIQUE INDEX "uidx_application_id_participant_role_id" ON "cats"."app_participant" ("application_id", "participant_role_id") `,
    );
  }
}
