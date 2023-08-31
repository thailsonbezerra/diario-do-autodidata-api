import * as moment from 'moment';
import { TopicEntity } from '../entity/topic.entity';

export class ReturnTopicUpdatedDto {
  id: number;
  name: string;
  status: boolean;
  subjectId: number;
  updatedAt: Date;

  constructor(topic: TopicEntity) {
    this.id = topic.id;
    this.name = topic.name;
    this.status = topic.status;
    this.subjectId = topic.subjectId;
    this.updatedAt = topic.updatedAt;
  }
}
