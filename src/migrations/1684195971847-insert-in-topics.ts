import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertInTopics1684195971847 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            insert into topics("id","name","status","subject_id")
            values (1,'Derivadas de Funções Trigonométricas',false,1);
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            drop table topics  
        `);
  }
}
