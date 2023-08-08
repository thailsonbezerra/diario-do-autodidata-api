import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TopicEntity } from './entity/topic.entity';
import { Repository } from 'typeorm';
import { CacheService } from '../cache/cache.service';
import { CreateTopicDto } from './dtos/createTopicDto';

@Injectable()
export class TopicService {
  constructor(
    @InjectRepository(TopicEntity)
    private readonly topicRepository: Repository<TopicEntity>,
    private readonly cacheService: CacheService,
  ) {}

  async getAllTopicsBySubjectId(subjectId: number): Promise<TopicEntity[]> {
    return this.cacheService.getCache<TopicEntity[]>(
      `subject_${subjectId}`,
      () => this.topicRepository.find({ where: { subjectId } }),
    );
  }

  async createBySubjectId(createTopic: CreateTopicDto): Promise<TopicEntity> {
    return await this.topicRepository.save(createTopic);
  }

  async getById(id: number) {
    const topic = await this.topicRepository.findOne({
      where: {
        id,
      },
    });

    if (!topic) {
      throw new NotFoundException(`TopicId: ${id} Not Found`);
    }

    return topic;
  }
}
