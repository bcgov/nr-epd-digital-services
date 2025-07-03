import { MigrationInterface, QueryRunner } from 'typeorm';

export class masterScript1748474062375 implements MigrationInterface {
  name = 'masterScript1748474062375';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cats"."application_service_type" DROP CONSTRAINT "FK_ffdc6e210bc9f805fe2c440e263"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."application_service_type" DROP COLUMN "roleId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."application_service_type" ALTER COLUMN "role_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."application_service_type" ADD CONSTRAINT "FK_a50be796c81668ff9f17dcb52ed" FOREIGN KEY ("role_id") REFERENCES "cats"."participant_role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cats"."application_service_type" DROP CONSTRAINT "FK_a50be796c81668ff9f17dcb52ed"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."application_service_type" ALTER COLUMN "role_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."application_service_type" ADD "roleId" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."application_service_type" ADD CONSTRAINT "FK_ffdc6e210bc9f805fe2c440e263" FOREIGN KEY ("roleId") REFERENCES "cats"."participant_role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
