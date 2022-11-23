import { MigrationInterface, QueryRunner } from "typeorm";

export class $npmConfigName1669242339896 implements MigrationInterface {
    name = '$npmConfigName1669242339896'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users"."region" ("id" SERIAL NOT NULL, "name" character varying(50) NOT NULL, CONSTRAINT "PK_5f48ffc3af96bc486f5f3f3a6da" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_region_id" ON "users"."region" ("id") `);
        await queryRunner.query(`CREATE TABLE "users"."organization_type" ("id" integer NOT NULL, "name" character varying(50) NOT NULL, CONSTRAINT "PK_42a3f102470c2b194b9bafc1f07" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_organization_type_id" ON "users"."organization_type" ("id") `);
        await queryRunner.query(`CREATE TABLE "users"."external_user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" character varying(50), "first_name" character varying(64) NOT NULL, "last_name" character varying(64) NOT NULL, "address_line" character varying(200) NOT NULL, "city" character varying(50) NOT NULL, "province" character varying(50) NOT NULL, "country" character varying(50) NOT NULL, "postal_code" character varying(20) NOT NULL, "email" character varying(320) NOT NULL, "phoneNumber" character varying(40) NOT NULL, "industry" character varying(250), "organization" character varying(250), "is_gst_exempt" boolean NOT NULL DEFAULT false, "is_billing_contact" boolean NOT NULL DEFAULT true, "user_work_status" character varying(10) NOT NULL, "user_fn_status" character varying(25) NOT NULL, "isProfileVerified" boolean NOT NULL, "organizationTypeId" integer, "regionId" integer, CONSTRAINT "UQ_0a7854c2b344b1852d418081334" UNIQUE ("user_id"), CONSTRAINT "REL_dd3c34d64279ce6e92e7122dad" UNIQUE ("organizationTypeId"), CONSTRAINT "REL_dbeaac78f640d753854eff275c" UNIQUE ("regionId"), CONSTRAINT "PK_ca5f437dd8b664627e45ec63369" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_externaluser_id" ON "users"."external_user" ("id") `);
        await queryRunner.query(`CREATE INDEX "IDX_externaluser_user_id" ON "users"."external_user" ("user_id") `);
        await queryRunner.query(`ALTER TABLE "users"."external_user" ADD CONSTRAINT "FK_dd3c34d64279ce6e92e7122dad3" FOREIGN KEY ("organizationTypeId") REFERENCES "users"."organization_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users"."external_user" ADD CONSTRAINT "FK_dbeaac78f640d753854eff275c0" FOREIGN KEY ("regionId") REFERENCES "users"."region"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users"."external_user" DROP CONSTRAINT "FK_dbeaac78f640d753854eff275c0"`);
        await queryRunner.query(`ALTER TABLE "users"."external_user" DROP CONSTRAINT "FK_dd3c34d64279ce6e92e7122dad3"`);
        await queryRunner.query(`DROP INDEX "users"."IDX_externaluser_user_id"`);
        await queryRunner.query(`DROP INDEX "users"."IDX_externaluser_id"`);
        await queryRunner.query(`DROP TABLE "users"."external_user"`);
        await queryRunner.query(`DROP INDEX "users"."IDX_organization_type_id"`);
        await queryRunner.query(`DROP TABLE "users"."organization_type"`);
        await queryRunner.query(`DROP INDEX "users"."IDX_region_id"`);
        await queryRunner.query(`DROP TABLE "users"."region"`);
    }

}
