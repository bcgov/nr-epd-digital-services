import { MigrationInterface, QueryRunner } from "typeorm";

export class masterScript1676445456037 implements MigrationInterface {
    name = 'masterScript1676445456037'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "epd_application"."application" ("id" SERIAL NOT NULL, "name" character varying, "userId" character varying, CONSTRAINT "PK_569e0c3e863ebdf5f2408ee1670" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "epd_application"."form" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "data" jsonb NOT NULL, "formId" character varying NOT NULL, "createdDate" date NOT NULL DEFAULT ('now'::text)::date, "modifiedDate" date NOT NULL DEFAULT ('now'::text)::date, CONSTRAINT "PK_8f72b95aa2f8ba82cf95dc7579e" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "epd_application"."form"`);
        await queryRunner.query(`DROP TABLE "epd_application"."application"`);
    }

}
