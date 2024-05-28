import { MigrationInterface, QueryRunner } from "typeorm";

export class MasterScript1715628483959 implements MigrationInterface {
    name = 'MasterScript1715628483959'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sites"."site_crown_land_contaminated" ALTER COLUMN "estimated_cost_of_remediations" TYPE double precision`);
        await queryRunner.query(`ALTER TABLE "sites"."site_crown_land_contaminated" ALTER COLUMN "actual_cost_of_remediations" TYPE double precision`);
        await queryRunner.query(`ALTER TABLE "sites"."sites" ALTER COLUMN "latdeg" TYPE double precision`);
        await queryRunner.query(`ALTER TABLE "sites"."sites" ALTER COLUMN "longdeg" TYPE double precision`);
        await queryRunner.query(`ALTER TABLE "sites"."sites" ALTER COLUMN "geometry" TYPE geometry`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sites"."sites" ALTER COLUMN "geometry" TYPE geometry(GEOMETRY,0)`);
        await queryRunner.query(`ALTER TABLE "sites"."sites" ALTER COLUMN "longdeg" TYPE double precision`);
        await queryRunner.query(`ALTER TABLE "sites"."sites" ALTER COLUMN "latdeg" TYPE double precision`);
        await queryRunner.query(`ALTER TABLE "sites"."site_crown_land_contaminated" ALTER COLUMN "actual_cost_of_remediations" TYPE double precision`);
        await queryRunner.query(`ALTER TABLE "sites"."site_crown_land_contaminated" ALTER COLUMN "estimated_cost_of_remediations" TYPE double precision`);
    }

}
