import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TopicEntity } from './entity/topic.entity';
import { Repository } from 'typeorm';
import { CacheService } from '../cache/cache.service';

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
}
