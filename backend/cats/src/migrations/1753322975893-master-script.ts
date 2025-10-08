import { MigrationInterface, QueryRunner } from "typeorm";

export class masterScript1753322975893 implements MigrationInterface {
    name = 'masterScript1753322975893'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cats"."invoice_attachment" DROP CONSTRAINT "FK_f750f0705196089999d9cf0dcbf"`);
        await queryRunner.query(`ALTER TABLE "cats"."invoice_item" DROP CONSTRAINT "FK_9830c1881dd701d440c2164c3cd"`);
        await queryRunner.query(`ALTER TABLE "cats"."invoice_attachment" ADD CONSTRAINT "FK_f750f0705196089999d9cf0dcbf" FOREIGN KEY ("invoice_id") REFERENCES "cats"."invoice_v2"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cats"."invoice_item" ADD CONSTRAINT "FK_9830c1881dd701d440c2164c3cd" FOREIGN KEY ("invoice_id") REFERENCES "cats"."invoice_v2"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cats"."invoice_item" DROP CONSTRAINT "FK_9830c1881dd701d440c2164c3cd"`);
        await queryRunner.query(`ALTER TABLE "cats"."invoice_attachment" DROP CONSTRAINT "FK_f750f0705196089999d9cf0dcbf"`);
        await queryRunner.query(`ALTER TABLE "cats"."invoice_item" ADD CONSTRAINT "FK_9830c1881dd701d440c2164c3cd" FOREIGN KEY ("invoice_id") REFERENCES "cats"."invoice_v2"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cats"."invoice_attachment" ADD CONSTRAINT "FK_f750f0705196089999d9cf0dcbf" FOREIGN KEY ("invoice_id") REFERENCES "cats"."invoice_v2"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
