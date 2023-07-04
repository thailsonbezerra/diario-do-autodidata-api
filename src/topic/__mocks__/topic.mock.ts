import { TopicEntity } from '../entity/topic.entity';

export const topicEntityMock: TopicEntity = {
  id: 333,
  name: 'name teste topic',
  status: true,
  subjectId: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
};
