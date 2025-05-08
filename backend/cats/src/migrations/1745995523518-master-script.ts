import { MigrationInterface, QueryRunner } from 'typeorm';

export class masterScript1745995523518 implements MigrationInterface {
  name = 'masterScript1745995523518';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cats"."application" RENAME COLUMN "assignment_size" TO "application_service_type_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."participant_role" ADD "assignment_factor" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."application" ADD CONSTRAINT "FK_639601e17d6b0baf7f1950437d1" FOREIGN KEY ("application_service_type_id") REFERENCES "cats"."application_service_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cats"."application" DROP CONSTRAINT "FK_639601e17d6b0baf7f1950437d1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."participant_role" DROP COLUMN "assignment_factor"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."application" RENAME COLUMN "application_service_type_id" TO "assignment_size"`,
    );
  }
}
