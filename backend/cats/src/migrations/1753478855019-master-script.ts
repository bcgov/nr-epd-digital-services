import { MigrationInterface, QueryRunner } from "typeorm";

export class masterScript1753478855019 implements MigrationInterface {
    name = 'masterScript1753478855019'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cats"."invoice_attachment" DROP COLUMN "file_size"`);
        await queryRunner.query(`ALTER TABLE "cats"."invoice_attachment" DROP COLUMN "mime_type"`);
        await queryRunner.query(`ALTER TABLE "cats"."invoice_attachment" ADD "bucket_id" uuid NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cats"."invoice_attachment" DROP COLUMN "bucket_id"`);
        await queryRunner.query(`ALTER TABLE "cats"."invoice_attachment" ADD "mime_type" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "cats"."invoice_attachment" ADD "file_size" integer NOT NULL`);
    }

}
