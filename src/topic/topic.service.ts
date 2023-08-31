import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TopicEntity } from './entity/topic.entity';
import { Repository } from 'typeorm';
import { CacheService } from '../cache/cache.service';
import { CreateTopicDto } from './dtos/createTopicDto';
import { SubjectService } from '../subject/subject.service';
import { NotationService } from '../notation/notation.service';
import { UpdateTopicDto } from './dtos/updateTopicDto';

@Injectable()
export class TopicService {
  constructor(
    @InjectRepository(TopicEntity)
    private readonly topicRepository: Repository<TopicEntity>,
    @Inject(forwardRef(() => SubjectService))
    private readonly subjectService: SubjectService,
    @Inject(forwardRef(() => NotationService))
    private readonly notationService: NotationService,
    private readonly cacheService: CacheService,
  ) {}

  async getAllTopicsBySubjectId(
    subjectId: number,
    userId: number,
  ): Promise<TopicEntity[]> {
    await this.subjectService.getById(subjectId, userId);

    return this.topicRepository.find({ where: { subjectId } });
  }

  async getById(id: number, userId: number): Promise<TopicEntity> {
    const topic = await this.cacheService.getCache<TopicEntity>(
      `topic_${id}`,
      () =>
        this.topicRepository.findOne({
          where: {
            id,
          },
          relations: {
            notations: true,
            subject: {
              user: true,
            },
          },
        }),
    );

    if (!topic) {
      throw new NotFoundException(`TopicId: ${id} Not Found`);
    }

    if (topic.subject.userId !== userId) {
      throw new NotFoundException(`TopicId: ${id} Not Found for that user`);
    }

    return topic;
  }

  async createBySubjectId(
    createTopic: CreateTopicDto,
    userId: number,
  ): Promise<TopicEntity> {
    const { subjectId } = createTopic;
    await this.subjectService.getById(subjectId, userId);

    const topic = await this.topicRepository.save(createTopic);

    await this.invalidateTopicCache(topic.id, userId);

    return topic;
  }

  async updateById(id: number, userId: number, updateTopic: UpdateTopicDto) {
    const topic = await this.getById(id, userId);

    await this.invalidateTopicCache(id, userId);

    const updateTopicData = { ...updateTopic, updatedAt: new Date() };
    this.topicRepository.merge(topic, updateTopicData);

    return await this.topicRepository.save(topic);
  }

  async deleteBySubjectId(subjectId: number, userId: number) {
    await this.subjectService.getById(subjectId, userId);

    const topics = await this.getAllTopicsBySubjectId(subjectId, userId);

    for (const { id: topicId } of topics) {
      await this.notationService.deleteByTopicId(topicId, userId);
      await this.invalidateTopicCache(topicId, userId);
    }

    return await this.topicRepository.delete({ subjectId });
  }

  async deleteById(id: number, userId: number) {
    await this.getById(id, userId);

    await this.notationService.deleteByTopicId(id, userId);

    await this.invalidateTopicCache(id, userId);

    return await this.topicRepository.delete(id);
  }

  async invalidateTopicCache(topicId: number, userId: number) {
    const { subjectId } = await this.getById(topicId, userId);

    const notations = await this.notationService.getAllNotationsByTopicId(
      topicId,
      userId,
    );

    for (const { id: notationId } of notations) {
      await this.cacheService.invalidateCache(`notation_${notationId}`);
    }

    await this.cacheService.invalidateCache(`topic_${topicId}`);
    await this.cacheService.invalidateCache(`subject_${subjectId}`);
  }
}
