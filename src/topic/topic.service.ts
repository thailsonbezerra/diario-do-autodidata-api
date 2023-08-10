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
import { NotationService } from 'src/notation/notation.service';

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

    await this.subjectService.getById(subjectId, userId);

    return await this.topicRepository.save(createTopic);
  }

  async deleteBySubjectId(subjectId: number, userId: number) {
    await this.subjectService.getById(subjectId, userId);

    const topics = await this.getAllTopicsBySubjectId(subjectId, userId);

    for (const topic of topics) {
      await this.notationService.deleteByTopicId(topic.id, userId);
    }

    return await this.topicRepository.delete({ subjectId });
  }

  async getById(id: number, userId: number): Promise<TopicEntity> {
    const topic = await this.topicRepository.findOne({
      where: {
        id,
      },
      relations: {
        notations: true,
        subject: {
          user: true,
        },
      },
    });

    if (!topic) {
      throw new NotFoundException(`TopicId: ${id} Not Found`);
    }

    if (topic.subject.userId !== userId) {
      throw new NotFoundException(`TopicId: ${id} Not Found for that user`);
    }

    return topic;
  }

  async deleteById(id: number, userId: number) {
    await this.getById(id, userId);

    await this.notationService.deleteByTopicId(id, userId);

    return await this.topicRepository.delete(id);
  }
}
