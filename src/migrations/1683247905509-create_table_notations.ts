import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableNotations1683247905509 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
        CREATE TABLE notations (
            id serial primary key,
            annotation text not null,
            topic_id integer not null,
            created_at TIMESTAMP default now() not null,
            updated_at TIMESTAMP default now() not null,
            foreign key (topic_id) references topics(id)
        );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
        drop table notations  
    `);
  }
}
