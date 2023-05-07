import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableTopics1683247861846 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
    CREATE TABLE topics (
        id serial primary key,
        name varchar not null,
        status boolean not null,
        subject_id integer not null,
        created_at TIMESTAMP default now() not null,
        updated_at TIMESTAMP default now() not null,
        foreign key (subject_id) references subjects(id)
    );
`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
        drop table topics  
    `);
  }
}
