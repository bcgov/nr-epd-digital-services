import { MigrationInterface, QueryRunner } from "typeorm";

export class masterScript1743710925353 implements MigrationInterface {
    name = 'masterScript1743710925353'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cats"."application" DROP COLUMN "srs_application_id"`);
        await queryRunner.query(`ALTER TABLE "cats"."application" ADD "form_id" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "cats"."application" ADD "submission_id" character varying(50)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cats"."application" DROP COLUMN "submission_id"`);
        await queryRunner.query(`ALTER TABLE "cats"."application" DROP COLUMN "form_id"`);
        await queryRunner.query(`ALTER TABLE "cats"."application" ADD "srs_application_id" integer`);
    }

}
