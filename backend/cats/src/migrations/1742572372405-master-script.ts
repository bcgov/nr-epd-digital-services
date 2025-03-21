import { MigrationInterface, QueryRunner } from "typeorm";

export class masterScript1742572372405 implements MigrationInterface {
    name = 'masterScript1742572372405'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cats"."application" ADD "srs_application_id" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cats"."application" DROP COLUMN "srs_application_id"`);
    }

}
