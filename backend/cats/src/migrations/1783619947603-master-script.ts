import { MigrationInterface, QueryRunner } from 'typeorm';

export class MasterScript1783619947603 implements MigrationInterface {
  name = 'MasterScript1783619947603';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_item" ADD "service_type_id" integer`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cats"."invoice_item" DROP COLUMN "service_type_id"`,
    );
  }
}
