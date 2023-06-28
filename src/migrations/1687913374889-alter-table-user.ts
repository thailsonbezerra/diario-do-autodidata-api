import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableUser1687913374889 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            alter table users add unique(email);
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(``);
  }
}
