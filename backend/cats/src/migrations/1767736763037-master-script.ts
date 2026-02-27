import { MigrationInterface, QueryRunner } from 'typeorm';

export class MasterScript1767736763037 implements MigrationInterface {
  name = 'MasterScript1767736763037';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "cats"."user_column_preferences" ("id" SERIAL NOT NULL, "user_id" character varying(255) NOT NULL, "page" character varying(100) NOT NULL, "column_config" jsonb NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_5179e356e09c15607e177a43ca9" UNIQUE ("user_id", "page"), CONSTRAINT "PK_f7145ea292a692d5d5e5bd28e5e" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "cats"."user_column_preferences"`);
  }
}
