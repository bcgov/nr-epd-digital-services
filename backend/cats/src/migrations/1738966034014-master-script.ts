import { MigrationInterface, QueryRunner } from "typeorm";

export class masterScript1738966034014 implements MigrationInterface {
    name = 'masterScript1738966034014'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cats"."person" ALTER COLUMN "is_env_consultant" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "cats"."person" ALTER COLUMN "row_version_count" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "cats"."person" ALTER COLUMN "updated_by" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "cats"."person" ALTER COLUMN "updated_datetime" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "cats"."person" ALTER COLUMN "ts" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cats"."person" ALTER COLUMN "ts" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "cats"."person" ALTER COLUMN "updated_datetime" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "cats"."person" ALTER COLUMN "updated_by" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "cats"."person" ALTER COLUMN "row_version_count" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "cats"."person" ALTER COLUMN "is_env_consultant" SET NOT NULL`);
    }

}
