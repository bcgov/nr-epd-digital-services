import { MigrationInterface, QueryRunner } from "typeorm";

export class masterScript1747432677645 implements MigrationInterface {
    name = 'masterScript1747432677645'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cats"."invoice_line_item" DROP CONSTRAINT "FK_b09242561f9c47a3288dc66c186"`);
        await queryRunner.query(`CREATE TABLE "cats"."person_permissions" ("id" SERIAL NOT NULL, "person_id" integer NOT NULL, "permission_id" integer NOT NULL, "created_by" character varying(20) NOT NULL, "created_datetime" TIMESTAMP NOT NULL, "updated_by" character varying(20), "updated_datetime" TIMESTAMP, CONSTRAINT "UQ_person_permission" UNIQUE ("person_id", "permission_id"), CONSTRAINT "PK_da83c9923f3c93a40f902b8b7b9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cats"."permissions" ("id" SERIAL NOT NULL, "role_id" integer NOT NULL, "description" character varying(250) NOT NULL, "created_by" character varying(20) NOT NULL, "created_datetime" TIMESTAMP NOT NULL, "updated_by" character varying(20), "updated_datetime" TIMESTAMP, CONSTRAINT "PK_920331560282b8bd21bb02290df" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "pk_person_permissions" ON "cats"."permissions" ("id") `);
        await queryRunner.query(`ALTER TABLE "cats"."participant_role" ADD "role_type" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "cats"."invoice_line_item" ADD CONSTRAINT "FK_b09242561f9c47a3288dc66c186" FOREIGN KEY ("invoiceId") REFERENCES "cats"."invoice_v2"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cats"."person_permissions" ADD CONSTRAINT "FK_b1135c1b01825ecae42fdd54bbb" FOREIGN KEY ("person_id") REFERENCES "cats"."person"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cats"."person_permissions" ADD CONSTRAINT "FK_6bd2d27b28f79cc7fd81e74967e" FOREIGN KEY ("permission_id") REFERENCES "cats"."permissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cats"."permissions" ADD CONSTRAINT "FK_f10931e7bb05a3b434642ed2797" FOREIGN KEY ("role_id") REFERENCES "cats"."participant_role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cats"."permissions" DROP CONSTRAINT "FK_f10931e7bb05a3b434642ed2797"`);
        await queryRunner.query(`ALTER TABLE "cats"."person_permissions" DROP CONSTRAINT "FK_6bd2d27b28f79cc7fd81e74967e"`);
        await queryRunner.query(`ALTER TABLE "cats"."person_permissions" DROP CONSTRAINT "FK_b1135c1b01825ecae42fdd54bbb"`);
        await queryRunner.query(`ALTER TABLE "cats"."invoice_line_item" DROP CONSTRAINT "FK_b09242561f9c47a3288dc66c186"`);
        await queryRunner.query(`ALTER TABLE "cats"."participant_role" DROP COLUMN "role_type"`);
        await queryRunner.query(`DROP INDEX "cats"."pk_person_permissions"`);
        await queryRunner.query(`DROP TABLE "cats"."permissions"`);
        await queryRunner.query(`DROP TABLE "cats"."person_permissions"`);
        await queryRunner.query(`ALTER TABLE "cats"."invoice_line_item" ADD CONSTRAINT "FK_b09242561f9c47a3288dc66c186" FOREIGN KEY ("invoiceId") REFERENCES "cats"."invoice_v2"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
