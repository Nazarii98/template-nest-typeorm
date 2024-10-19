import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1708356866955 implements MigrationInterface {
  name = 'InitialMigration1708356866955';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
        `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "nickname" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "refresh_token" character varying, "current_mental_prompt_id" uuid NOT NULL, CONSTRAINT "IDX_UNIQ_user_email" UNIQUE ("email"), CONSTRAINT "IDX_UNIQ_user_nickname" UNIQUE ("nickname"), CONSTRAINT "IDX_UNIQ_user_refresh_token" UNIQUE ("refresh_token"), CONSTRAINT "PK_user_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
        `ALTER TABLE "user" ADD CONSTRAINT "FK_user_mental_prompts_current_mental_prompt_id_id" FOREIGN KEY ("current_mental_prompt_id") REFERENCES "mental_prompts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_user_mental_prompts_current_mental_prompt_id_id"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
