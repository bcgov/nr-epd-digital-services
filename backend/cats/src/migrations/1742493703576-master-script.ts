import { MigrationInterface, QueryRunner } from "typeorm";

export class masterScript1742493703576 implements MigrationInterface {
    name = 'masterScript1742493703576'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cats"."app_participant" ALTER COLUMN "row_version_count" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "cats"."app_participant" ALTER COLUMN "updated_by" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "cats"."app_participant" ALTER COLUMN "updated_date_time" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "cats"."app_participant" ALTER COLUMN "ts" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cats"."app_participant" ALTER COLUMN "ts" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "cats"."app_participant" ALTER COLUMN "updated_date_time" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "cats"."app_participant" ALTER COLUMN "updated_by" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "cats"."app_participant" ALTER COLUMN "row_version_count" SET NOT NULL`);
    }

}
