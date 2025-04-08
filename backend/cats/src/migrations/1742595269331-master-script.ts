import { MigrationInterface, QueryRunner } from "typeorm";

export class masterScript1742595269331 implements MigrationInterface {
    name = 'masterScript1742595269331'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cats"."application" ALTER COLUMN "ts" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cats"."application" ALTER COLUMN "ts" SET NOT NULL`);
    }

}
