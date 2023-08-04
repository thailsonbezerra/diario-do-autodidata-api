import * as moment from 'moment';
import { ReturnNotationDto } from '../../notation/dtos/returnNotation.dto';
import { TopicEntity } from '../entity/topic.entity';

export class ReturnTopicDto {
  id: number;
  name: string;
  status: boolean;
  dateTopic: string;
  notations?: ReturnNotationDto[];

  constructor(topic: TopicEntity) {
    this.id = topic.id;
    this.name = topic.name;
    this.status = topic.status;
    this.dateTopic = moment(topic.createdAt).format('DD/MM/YYYY');
    this.notations = topic.notations
      ? topic.notations.map((notation) => new ReturnNotationDto(notation))
      : undefined;
  }
}
