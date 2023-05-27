import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TopicEntity } from './entity/topic.entity';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class TopicService {
  constructor(
    @InjectRepository(TopicEntity)
    private readonly topicRepository: Repository<TopicEntity>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getAllTopicsBySubjectId(subjectId: number): Promise<TopicEntity[]> {
    const topicsCache: TopicEntity[] = await this.cacheManager.get(
      `topic_${subjectId}`,
    );

    if (topicsCache) {
      return topicsCache;
    }

    const topics = await this.topicRepository.find({
      where: {
        subjectId,
      },
    });

    await this.cacheManager.set(`topic_${subjectId}`, topics);

    return topics;
  }
}
