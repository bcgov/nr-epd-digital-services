import { MigrationInterface, QueryRunner } from 'typeorm';

export class masterScript1669342963265 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO "epd_users".region(region_name)	VALUES ('Vancouver Island/Coast');`,
    );
    await queryRunner.query(
      `INSERT INTO "epd_users".region(region_name)	VALUES ('Mainland/Southwest');`,
    );
    await queryRunner.query(
      `INSERT INTO "epd_users".region(region_name)	VALUES ('Thompson-Okanagan');`,
    );
    await queryRunner.query(
      `INSERT INTO "epd_users".region(region_name)	VALUES ('Mainland/Southwest');`,
    );
    await queryRunner.query(
      `INSERT INTO "epd_users".region(region_name)	VALUES ('Kootenay');`,
    );
    await queryRunner.query(
      `INSERT INTO "epd_users".region(region_name)	VALUES ('Cariboo');`,
    );
    await queryRunner.query(
      `INSERT INTO "epd_users".region(region_name)	VALUES ('North Coast');`,
    );
    await queryRunner.query(
      `INSERT INTO "epd_users".region(region_name)	VALUES ('Nechako');`,
    );
    await queryRunner.query(
      `INSERT INTO "epd_users".region(region_name)	VALUES ('Northeast');`,
    );

    await queryRunner.query(
      `INSERT INTO "epd_users".organization_type(org_name) VALUES('Financial Institution');`,
    );
    await queryRunner.query(
      `INSERT INTO "epd_users".organization_type(org_name) VALUES('Real Estate Organization');`,
    );
    await queryRunner.query(
      `INSERT INTO "epd_users".organization_type(org_name) VALUES('Municipality');`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "epd_users".region`);

    await queryRunner.query(`DELETE FROM "epd_users".organization_type`);
  }
}
