import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertInUsers1684195950147 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            insert into users("name","email","cpf","password") values ('teste1', 'teste1@teste.com','00000000000','teste123');
            insert into users("name","email","cpf","password") values ('teste2', 'teste2@teste.com','11111111111', 'teste123');
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            drop table users  
        `);
  }
}
