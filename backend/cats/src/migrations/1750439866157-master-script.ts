import { MigrationInterface, QueryRunner } from "typeorm";

export class masterScript1750439866157 implements MigrationInterface {
    name = 'masterScript1750439866157'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cats"."application" DROP COLUMN "form_id"`);
        await queryRunner.query(`ALTER TABLE "cats"."application" DROP COLUMN "submission_id"`);
        await queryRunner.query(`ALTER TABLE "cats"."app_status" ADD "form_id" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "cats"."app_status" ADD "submission_id" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "cats"."app_status" DROP CONSTRAINT "FK_33e54882e3e4e9145299f480dea"`);
        await queryRunner.query(`ALTER TABLE "cats"."app_status" ADD CONSTRAINT "FK_33e54882e3e4e9145299f480dea" FOREIGN KEY ("application_id") REFERENCES "cats"."application"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cats"."app_status" DROP CONSTRAINT "FK_33e54882e3e4e9145299f480dea"`);
        await queryRunner.query(`ALTER TABLE "cats"."app_status" ADD CONSTRAINT "FK_33e54882e3e4e9145299f480dea" FOREIGN KEY ("application_id") REFERENCES "cats"."application"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cats"."app_status" DROP COLUMN "submission_id"`);
        await queryRunner.query(`ALTER TABLE "cats"."app_status" DROP COLUMN "form_id"`);
        await queryRunner.query(`ALTER TABLE "cats"."application" ADD "submission_id" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "cats"."application" ADD "form_id" character varying(50)`);
    }

}
