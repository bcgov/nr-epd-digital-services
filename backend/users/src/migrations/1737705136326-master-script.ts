import { MigrationInterface, QueryRunner } from "typeorm";

export class masterScript1737705136326 implements MigrationInterface {
    name = 'masterScript1737705136326'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "epd_users"."people" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "is_tax_exempt" boolean NOT NULL, "is_env_consultant" boolean NOT NULL, "login_user_name" character varying NOT NULL, "address_line1" character varying NOT NULL, "address_line2" character varying, "city" character varying NOT NULL, "province" character varying NOT NULL, "country" character varying NOT NULL, "postal_code" character varying NOT NULL, "phone" character varying, "mobile" character varying, "fax" character varying, "email" character varying NOT NULL, "is_active" boolean NOT NULL, "created_by" character varying NOT NULL, "created_date_time" TIMESTAMP NOT NULL, "updated_by" character varying NOT NULL, "updated_date_time" TIMESTAMP, CONSTRAINT "PK_aa866e71353ee94c6cc51059c5b" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "epd_users"."people"`);
    }

}
