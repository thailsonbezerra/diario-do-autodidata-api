import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableStatusSubject1684195903612
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            alter table status_subject add column color varchar default null;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
        drop table status_subject  
    `);
  }
}
