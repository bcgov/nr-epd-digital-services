import { MigrationInterface, QueryRunner } from 'typeorm';

export class masterScript1679428396928 implements MigrationInterface {
  name = 'masterScript1679428396928';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "epd_applications"."application" ("id" SERIAL NOT NULL, "name" character varying, "userId" character varying, "created_date" date NOT NULL DEFAULT ('now'::text)::date, "modified_date" date NOT NULL DEFAULT ('now'::text)::date, CONSTRAINT "PK_569e0c3e863ebdf5f2408ee1670" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "epd_applications"."form" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "form_data" jsonb NOT NULL, "form_id" character varying NOT NULL, "created_date" date NOT NULL DEFAULT ('now'::text)::date, "modified_date" date NOT NULL DEFAULT ('now'::text)::date, CONSTRAINT "PK_8f72b95aa2f8ba82cf95dc7579e" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "epd_applications"."form"`);
    await queryRunner.query(`DROP TABLE "epd_applications"."application"`);
  }
}
