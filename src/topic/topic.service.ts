import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TopicEntity } from './entity/topic.entity';
import { Repository } from 'typeorm';
import { CacheService } from '../cache/cache.service';
import { CreateTopicDto } from './dtos/createTopicDto';
import { SubjectService } from 'src/subject/subject.service';

@Injectable()
export class TopicService {
  constructor(
    @InjectRepository(TopicEntity)
    private readonly topicRepository: Repository<TopicEntity>,
    private readonly subjectService: SubjectService,
    private readonly cacheService: CacheService,
  ) {}

  async getAllTopicsBySubjectId(
    subjectId: number,
    userId: number,
  ): Promise<TopicEntity[]> {
    const subject = await this.subjectService.getById(subjectId);

    const isUser = subject.userId === userId;

    if (!isUser) {
      throw new NotFoundException(
        `Topic Not Found by SubjectId: ${subjectId} for that user`,
      );
    }

    return this.cacheService.getCache<TopicEntity[]>(
      `subject_${subjectId}`,
      () => this.topicRepository.find({ where: { subjectId } }),
    );
  }

  async createBySubjectId(
    createTopic: CreateTopicDto,
    userId: number,
  ): Promise<TopicEntity> {
    const { subjectId } = createTopic;

    const subject = await this.subjectService.getById(subjectId);

    const isUser = subject.userId === userId;

    if (!isUser) {
      throw new NotFoundException(
        `Topic Not Found by SubjectId: ${subjectId} for that user`,
      );
    }
    return await this.topicRepository.save(createTopic);
  }

  async getById(id: number): Promise<TopicEntity> {
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
