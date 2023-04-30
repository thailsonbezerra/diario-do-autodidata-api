import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTable1682831120793 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
        CREATE TABLE users (
            id serial primary key,
            name varchar not null,
            email varchar not null,
            cpf varchar not null,
            password varchar not null,
            created_at TIMESTAMP default now() not null,
            updated_at TIMESTAMP default now() not null
        );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
        drop table users    
    `);
  }
}
