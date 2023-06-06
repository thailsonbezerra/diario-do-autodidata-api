import { ReturnTopicDto } from 'src/topic/dtos/returnTopic.dto';
import { SubjectEntity } from '../entity/subject.entity';

export class ReturnSubjectDto {
  name: string;
  description: string;
  statusId: number;
  topics?: ReturnTopicDto[];

  constructor(subject: SubjectEntity) {
    this.name = subject.name;
    this.description = subject.description;
    this.statusId = subject.statusId;
    this.topics = subject.topics
      ? subject.topics.map((topic) => new ReturnTopicDto(topic))
      : undefined;
  }
}
