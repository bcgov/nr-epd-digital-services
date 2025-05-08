import { MigrationInterface, QueryRunner } from 'typeorm';

export class masterScript1746548370218 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_line_item" DROP CONSTRAINT "FK_b09242561f9c47a3288dc66c186"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_line_item" ADD CONSTRAINT "FK_b09242561f9c47a3288dc66c186" FOREIGN KEY ("invoiceId") REFERENCES "cats"."invoice_v2"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_line_item" DROP CONSTRAINT "FK_b09242561f9c47a3288dc66c186"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_line_item" ADD CONSTRAINT "FK_b09242561f9c47a3288dc66c186" FOREIGN KEY ("invoiceId") REFERENCES "cats"."invoice_v2"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
