import { MigrationInterface, QueryRunner } from "typeorm"

export class $npmConfigName1669242359289 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`INSERT INTO users.region(name)	VALUES ('Region 1');`);
        await queryRunner.query(`INSERT INTO users.region(name)	VALUES ('Region 2');`);
        await queryRunner.query(`INSERT INTO users.region(name)	VALUES ('Region 3');`);
        await queryRunner.query(`INSERT INTO users.region(name)	VALUES ('Region 4');`);
        await queryRunner.query(`INSERT INTO users.region(name)	VALUES ('Region 5');`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
