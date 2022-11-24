import { MigrationInterface, QueryRunner } from "typeorm"

export class masterScript1669274888299 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`INSERT INTO "epdusers".region(name)	VALUES ('Vancouver Island/Coast');`);
        await queryRunner.query(`INSERT INTO "epdusers".region(name)	VALUES ('Mainland/Southwest');`);
        await queryRunner.query(`INSERT INTO "epdusers".region(name)	VALUES ('Thompson-Okanagan');`);
        await queryRunner.query(`INSERT INTO "epdusers".region(name)	VALUES ('Mainland/Southwest');`);
        await queryRunner.query(`INSERT INTO "epdusers".region(name)	VALUES ('Kootenay');`);
        await queryRunner.query(`INSERT INTO "epdusers".region(name)	VALUES ('Cariboo');`);
        await queryRunner.query(`INSERT INTO "epdusers".region(name)	VALUES ('North Coast');`);
        await queryRunner.query(`INSERT INTO "epdusers".region(name)	VALUES ('Nechako');`);
        await queryRunner.query(`INSERT INTO "epdusers".region(name)	VALUES ('Northeast');`);


        await queryRunner.query(`INSERT INTO "epdusers".organization_type(name) VALUES('Financial Institution');`);
        await queryRunner.query(`INSERT INTO "epdusers".organization_type(name) VALUES('Real Estate Organization');`);
        await queryRunner.query(`INSERT INTO "epdusers".organization_type(name) VALUES('Municipality');`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
