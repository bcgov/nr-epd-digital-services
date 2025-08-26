import { MigrationInterface, QueryRunner } from "typeorm";

export class masterScript1753816933815 implements MigrationInterface {
    name = 'masterScript1753816933815'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "cats"."application_site" ("id" SERIAL NOT NULL, "application_id" integer NOT NULL, "site_id" integer NOT NULL, "created_by" character varying(20) NOT NULL, "created_date_time" TIMESTAMP NOT NULL, "updated_by" character varying(20) NOT NULL, "updated_date_time" TIMESTAMP NOT NULL, CONSTRAINT "PK_b26ef2c7ff60863c8194498b290" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_application_site_application_id" ON "cats"."application_site" ("application_id") `);
        await queryRunner.query(`ALTER TABLE "cats"."application" ADD "is_multi_site" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cats"."application" DROP COLUMN "is_multi_site"`);
        await queryRunner.query(`DROP INDEX "cats"."idx_application_site_application_id"`);
        await queryRunner.query(`DROP TABLE "cats"."application_site"`);
    }

}
