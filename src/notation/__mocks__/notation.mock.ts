import { NotationEntity } from '../entity/notation.entity';

export const notationEntityMock: NotationEntity = {
  id: 1,
  annotation: 'mock notation',
  topicId: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
};
