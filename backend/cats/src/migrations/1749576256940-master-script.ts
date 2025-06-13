import { MigrationInterface, QueryRunner } from 'typeorm';

export class masterScript1749576256940 implements MigrationInterface {
  name = 'masterScript1749576256940';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "cats"."permission_service_type_mapping" ("id" SERIAL NOT NULL, "permission_id" integer NOT NULL, "service_type_id" integer NOT NULL, CONSTRAINT "PK_b263a7c43f4b364003e69d4d4de" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."permission_service_type_mapping" ADD CONSTRAINT "FK_c217e48bcdaa00c7d8ccba9250f" FOREIGN KEY ("permission_id") REFERENCES "cats"."permissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."permission_service_type_mapping" ADD CONSTRAINT "FK_9463cfc7fc71e49d60e0dc3842c" FOREIGN KEY ("service_type_id") REFERENCES "cats"."application_service_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cats"."permission_service_type_mapping" DROP CONSTRAINT "FK_9463cfc7fc71e49d60e0dc3842c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."permission_service_type_mapping" DROP CONSTRAINT "FK_c217e48bcdaa00c7d8ccba9250f"`,
    );
    await queryRunner.query(
      `DROP TABLE "cats"."permission_service_type_mapping"`,
    );
  }
}
