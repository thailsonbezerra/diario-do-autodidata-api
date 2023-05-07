import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableSubjects1683247844046 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
        CREATE TABLE subjects (
            id serial primary key,
            name varchar not null,
            description text not null,
            user_id integer not null,
            status_id integer not null,
            created_at TIMESTAMP default now() not null,
            updated_at TIMESTAMP default now() not null,
            foreign key (user_id) references users(id),
            foreign key (status_id) references status_subject(id)
        );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
        drop table subjects  
    `);
  }
}
