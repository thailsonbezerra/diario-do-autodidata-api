import {
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotationEntity } from './entity/notation.entity';
import { CreateNotationDto } from './dtos/createNotationDto';
import { SubjectService } from '../subject/subject.service';
import { TopicService } from '../topic/topic.service';
import { UpdateNotationDto } from './dtos/updateNotationDto';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class NotationService {
  constructor(
    @InjectRepository(NotationEntity)
    private readonly notationRepository: Repository<NotationEntity>,
    @Inject(forwardRef(() => TopicService))
    private readonly topicService: TopicService,
    private readonly subjectService: SubjectService,
    private readonly cacheService: CacheService,
  ) {}

  async getAllNotationsByTopicId(topicId: number, userId: number) {
    const notation = await this.notationRepository.find({
      where: {
        topicId,
      },
    });

    const { subjectId } = await this.topicService.getById(topicId, userId);

    await this.subjectService.getById(subjectId, userId);

    return notation;
  }

  async getById(id: number, userId: number) {
    const notation = await this.cacheService.getCache<NotationEntity>(
      `notation_${id}`,
      () =>
        this.notationRepository.findOne({
          where: { id },
          relations: {
            topic: {
              subject: {
                user: true,
              },
            },
          },
        }),
    );

    if (!notation) {
      throw new NotFoundException(`NotationId: ${id} Not Found`);
    }

    if (notation.topic.subject.userId !== userId) {
      throw new NotFoundException(`NotationId: ${id} Not Found for that user`);
    }

    return notation;
  }

  async createByTopicId(
    createNotation: CreateNotationDto,
    userId: number,
  ): Promise<NotationEntity> {
    const { topicId } = createNotation;

    const { subjectId } = await this.topicService.getById(topicId, userId);
    await this.subjectService.getById(subjectId, userId);

    const notation = await this.notationRepository.save(createNotation);

    await this.invalidateNotationCache(notation.id, userId);

    return notation;
  }

  async updateById(
    id: number,
    userId: number,
    updateNotation: UpdateNotationDto,
  ) {
    await this.getById(id, userId);

    await this.invalidateNotationCache(id, userId);

    return await this.notationRepository.update(
      { id },
      { ...updateNotation, updatedAt: new Date() },
    );
  }

  async deleteByTopicId(topicId: number, userId: number) {
    const { subjectId } = await this.topicService.getById(topicId, userId);

    await this.subjectService.getById(subjectId, userId);

    const notations = await this.getAllNotationsByTopicId(topicId, userId);

    for (const { id: notationId } of notations) {
      await this.invalidateNotationCache(notationId, userId);
      await this.notationRepository.delete({ id: notationId });
    }

    return HttpStatus.OK;
  }

  async deleteById(id: number, userId: number) {
    await this.getById(id, userId);

    await this.invalidateNotationCache(id, userId);
    return await this.notationRepository.delete(id);
  }

  async invalidateNotationCache(notationId: number, userId: number) {
    const { topicId } = await this.getById(notationId, userId);
    const { subjectId } = await this.topicService.getById(topicId, userId);

    await this.cacheService.invalidateCache(`notation_${notationId}`);
    await this.cacheService.invalidateCache(`topic_${topicId}`);
    await this.cacheService.invalidateCache(`subject_${subjectId}`);
  }
}
