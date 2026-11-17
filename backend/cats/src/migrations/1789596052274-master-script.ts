import { MigrationInterface, QueryRunner } from 'typeorm';

export class MasterScript1789596052274 implements MigrationInterface {
  name = 'MasterScript1789596052274';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cats"."application" DROP CONSTRAINT "FK_b26ef2c7ff60863c8194498b290"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cats"."application" ADD CONSTRAINT "FK_b26ef2c7ff60863c8194498b290" FOREIGN KEY ("site_id") REFERENCES "cats"."site"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
