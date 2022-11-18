import { MigrationInterface, QueryRunner } from "typeorm";

export class $npmConfigName1668639483003 implements MigrationInterface {
    name = '$npmConfigName1668639483003'

    public async up(queryRunner: QueryRunner): Promise<void> {       

        await queryRunner.query(`CREATE TABLE "users"."user" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"."user"`);
    }

}
