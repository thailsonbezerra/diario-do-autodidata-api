import { NotationEntity } from '../entity/notation.entity';

export class ReturnNotationUpdatedDto {
  id: number;
  annotation: string;
  topicId: number;
  updatedAt: Date;

  constructor(notation: NotationEntity) {
    this.id = notation.id;
    this.annotation = notation.annotation;
    this.topicId = notation.topicId;
    this.updatedAt = notation.updatedAt;
  }
}
