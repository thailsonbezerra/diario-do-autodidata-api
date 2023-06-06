import { NotationEntity } from '../entity/notation.entity';

export class ReturnNotationDto {
  annotation: string;

  constructor(notation: NotationEntity) {
    this.annotation = notation.annotation;
  }
}
