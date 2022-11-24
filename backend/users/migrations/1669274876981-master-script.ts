import { MigrationInterface, QueryRunner } from "typeorm";

export class masterScript1669274876981 implements MigrationInterface {
    name = 'masterScript1669274876981'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "epdusers"."region" ("id" SERIAL NOT NULL, "name" character varying(50) NOT NULL, CONSTRAINT "PK_5f48ffc3af96bc486f5f3f3a6da" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_region_id" ON "epdusers"."region" ("id") `);
        await queryRunner.query(`CREATE TABLE "epdusers"."organization_type" ("id" SERIAL NOT NULL, "name" character varying(50) NOT NULL, CONSTRAINT "PK_42a3f102470c2b194b9bafc1f07" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_organization_type_id" ON "epdusers"."organization_type" ("id") `);
        await queryRunner.query(`CREATE TABLE "epdusers"."external_user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" character varying(50), "first_name" character varying(64) NOT NULL, "last_name" character varying(64) NOT NULL, "address_line" character varying(200) NOT NULL, "city" character varying(50) NOT NULL, "province" character varying(50) NOT NULL, "country" character varying(50) NOT NULL, "postal_code" character varying(20) NOT NULL, "email" character varying(320) NOT NULL, "phoneNumber" character varying(40) NOT NULL, "industry" character varying(250), "organization" character varying(250), "is_gst_exempt" boolean NOT NULL DEFAULT false, "is_billing_contact" boolean NOT NULL DEFAULT true, "user_work_status" character varying(10) NOT NULL, "user_fn_status" character varying(25) NOT NULL, "organizationTypeId" integer, "regionId" integer, "isProfileVerified" boolean NOT NULL, CONSTRAINT "UQ_0a7854c2b344b1852d418081334" UNIQUE ("user_id"), CONSTRAINT "PK_ca5f437dd8b664627e45ec63369" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_externaluser_id" ON "epdusers"."external_user" ("id") `);
        await queryRunner.query(`CREATE INDEX "IDX_externaluser_user_id" ON "epdusers"."external_user" ("user_id") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "epdusers"."IDX_externaluser_user_id"`);
        await queryRunner.query(`DROP INDEX "epdusers"."IDX_externaluser_id"`);
        await queryRunner.query(`DROP TABLE "epdusers"."external_user"`);
        await queryRunner.query(`DROP INDEX "epdusers"."IDX_organization_type_id"`);
        await queryRunner.query(`DROP TABLE "epdusers"."organization_type"`);
        await queryRunner.query(`DROP INDEX "epdusers"."IDX_region_id"`);
        await queryRunner.query(`DROP TABLE "epdusers"."region"`);
    }

}
