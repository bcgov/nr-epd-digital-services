import { MigrationInterface, QueryRunner } from "typeorm";

export class masterScript1738103842043 implements MigrationInterface {
    name = 'masterScript1738103842043'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "epd_users"."people" ADD "middle_name" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "epd_users"."people" DROP COLUMN "middle_name"`);
    }

}
