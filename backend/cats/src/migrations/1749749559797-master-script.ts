import { MigrationInterface, QueryRunner } from 'typeorm';

export class masterScript1749749559797 implements MigrationInterface {
  name = 'masterScript1749749559797';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "cats"."recent_viewed_applications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" character varying(100) NOT NULL, "application_id" integer NOT NULL, "site_id" character varying NOT NULL, "address" character varying(200) NOT NULL, "applicationType" character varying(200) NOT NULL, "visited_by" character varying(20) NOT NULL, "visited_date_time" TIMESTAMP NOT NULL, CONSTRAINT "PK_3167e234c079a2767c4a1fa501a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "idx_user_id_site_id_application_id" ON "cats"."recent_viewed_applications" ("user_id", "site_id", "application_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_user_id" ON "cats"."recent_viewed_applications" ("user_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "cats"."recent_viewed_applications" ADD CONSTRAINT "FK_825327ee519bffcfc8f08bb3994" FOREIGN KEY ("application_id") REFERENCES "cats"."application"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cats"."recent_viewed_applications" DROP CONSTRAINT "FK_825327ee519bffcfc8f08bb3994"`,
    );
    await queryRunner.query(`DROP TABLE "cats"."recent_viewed_applications"`);
  }
}
