import { ReturnNotationDto } from 'src/notation/dtos/returnNotation.dto';
import { TopicEntity } from '../entity/topic.entity';

export class ReturnTopicDto {
  name: string;
  status: boolean;
  notations?: ReturnNotationDto[];

  constructor(topic: TopicEntity) {
    this.name = topic.name;
    this.status = topic.status;
    this.notations = topic.notations
      ? topic.notations.map((notation) => new ReturnNotationDto(notation))
      : undefined;
  }
}
