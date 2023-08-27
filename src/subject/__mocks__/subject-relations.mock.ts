import { topicRelationsMock } from '../../topic/__mocks__/topic-relations.mock';
import { SubjectEntity } from '../entity/subject.entity';

export const subjectRelationsMock: SubjectEntity = {
  id: 1,
  name: 'name teste subject',
  description: 'description teste subject',
  statusId: 1,
  userId: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
  topics: [topicRelationsMock],
};
