import { MigrationInterface, QueryRunner } from 'typeorm';

export class masterScript1745959015865 implements MigrationInterface {
  name = 'masterScript1745959015865';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "cats"."application_service_type" ("id" SERIAL NOT NULL, "service_name" character varying NOT NULL, "assignment_factor" integer NOT NULL, "service_type" character varying NOT NULL, CONSTRAINT "PK_3c0630af4bf55d8ac8cdec4bfa8" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "cats"."application_service_type"`);
  }
}
