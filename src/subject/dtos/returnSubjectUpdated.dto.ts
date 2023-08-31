import { ReturnTopicDto } from '../../topic/dtos/returnTopic.dto';
import { SubjectEntity } from '../entity/subject.entity';

export class ReturnSubjectUpdatedDto {
  id: number;
  name: string;
  description: string;
  statusId: number;
  userId: number;
  updatedAt: Date;

  constructor(subject: SubjectEntity) {
    this.id = subject.id;
    this.name = subject.name;
    this.description = subject.description;
    this.statusId = subject.statusId;
    this.userId = subject.userId;
    this.updatedAt = subject.updatedAt;
  }
}
