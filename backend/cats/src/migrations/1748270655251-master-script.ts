import { MigrationInterface, QueryRunner } from "typeorm";

export class masterScript1748270655251 implements MigrationInterface {
    name = 'masterScript1748270655251'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
      SELECT setval(
        'cats.application_id_seq',
        (SELECT MAX(id) FROM cats.application) + 1,
        false
      );
    `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Optionally reset the sequence if needed
    }

}
