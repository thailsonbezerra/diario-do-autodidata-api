import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertInNotations1684195979142 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
      insert into notations("id","annotation","topic_id")
      values (1,'Comecei o introdutório sobre trigonométria para ter capacidade de analisar a relação existente entre ângulos de triangulo e o comprimento dos seus lados.',1);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            drop table notations  
        `);
  }
}
