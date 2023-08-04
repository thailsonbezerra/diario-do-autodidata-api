import * as moment from 'moment';
import { ReturnTopicDto } from '../../topic/dtos/returnTopic.dto';
import { SubjectEntity } from '../entity/subject.entity';

export class returnAllFromSubject {
  id: number;
  name: string;
  description: string;
  created: string;
  status: string;
  topics?: ReturnTopicDto[];

  constructor(subject: SubjectEntity) {
    this.id = subject.id;
    this.name = subject.name;
    this.description = subject.description;
    this.created = moment(subject.createdAt)
      .format('DD/MM/YYYY à HH:mm:SS')
      .replace('à', 'às');
    this.topics = subject.topics
      ? subject.topics.map((topic) => new ReturnTopicDto(topic))
      : undefined;
  }
}
