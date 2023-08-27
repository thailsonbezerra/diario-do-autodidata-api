import { notationEntityMock } from '../../notation/__mocks__/notation.mock';
import { TopicEntity } from '../entity/topic.entity';

export const topicRelationsMock: TopicEntity = {
  id: 1,
  name: 'name teste topic',
  status: true,
  subjectId: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
  notations: [notationEntityMock],
};
