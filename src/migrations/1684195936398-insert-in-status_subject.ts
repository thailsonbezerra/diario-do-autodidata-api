import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertInStatusSubject1684195936398 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            insert into status_subject("id","name", "color") values (1,'Iniciar','blue');
            insert into status_subject("id","name", "color") values (2, 'Em andamento', 'yellow');
            insert into status_subject("id","name", "color") values (3, 'Concluido', 'green');
            insert into status_subject("id","name", "color") values (4, 'Abandonado', 'red');
            insert into status_subject("id","name", "color") values (5, 'Congelado', 'orange');
            insert into status_subject("id","name", "color") values (6, 'Revisando', 'pink');
            insert into status_subject("id","name", "color") values (7, 'Revisado', 'purple');
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            drop table status_subject  
        `);
  }
}
