import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableStatusSubject1583847772630
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            CREATE TABLE status_subject (
                id serial primary key,
                name varchar not null
            );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            drop table status_subject  
        `);
  }
}
