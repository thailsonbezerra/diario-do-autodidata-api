import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TopicEntity } from './entity/topic.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TopicService {
  constructor(
    @InjectRepository(TopicEntity)
    private readonly topicRepository: Repository<TopicEntity>,
  ) {}

  async getAllTopicsBySubjectId(subjectId: number): Promise<TopicEntity[]> {
    return await this.topicRepository.find({
      where: {
        subjectId,
      },
    });
  }
}
