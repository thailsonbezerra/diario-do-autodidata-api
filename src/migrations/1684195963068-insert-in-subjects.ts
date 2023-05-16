import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertInSubjects1684195963068 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
        insert
            into
            subjects("id",
            "name",
            "description",
            "user_id",
            "status_id")
        values (1,
            'Derivadas',
            'No cálculo, a derivada em um ponto de uma função y=f(x) representa a taxa de variação instantânea de y em relação a x neste ponto. Um exemplo típico é a função velocidade que representa a taxa de variação da função espaço. Do mesmo modo, a função aceleração é a derivada da função velocidade.',
            1,
            1)
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            drop table subjects  
        `);
  }
}
