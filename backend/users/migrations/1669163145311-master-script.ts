import { MigrationInterface, QueryRunner } from 'typeorm';

export class masterScript1669163145311 implements MigrationInterface {
  name = 'masterScript1669163145311';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "epd_users"."external_user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" character varying(50), "first_name" character varying(64) NOT NULL, "last_name" character varying(64) NOT NULL, "address_line" character varying(200) NOT NULL, "city" character varying(50) NOT NULL, "province" character varying(50) NOT NULL, "country" character varying(50) NOT NULL, "postal_code" character varying(20) NOT NULL, "email" character varying(320) NOT NULL, "phoneNumber" character varying(40) NOT NULL, "organization" character varying(250), "user_type" integer NOT NULL DEFAULT '0', "organization_type" integer NOT NULL DEFAULT '0', "user_identity" integer NOT NULL DEFAULT '0', "is_gst_exempt" boolean NOT NULL DEFAULT false, "is_billing_contact" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_0a7854c2b344b1852d418081334" UNIQUE ("user_id"), CONSTRAINT "PK_ca5f437dd8b664627e45ec63369" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_externaluser_id" ON "epd_users"."external_user" ("id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_externaluser_user_id" ON "epd_users"."external_user" ("user_id") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "epd_users"."IDX_externaluser_user_id"`,
    );
    await queryRunner.query(`DROP INDEX "epd_users"."IDX_externaluser_id"`);
    await queryRunner.query(`DROP TABLE "epd_users"."external_user"`);
  }
}
