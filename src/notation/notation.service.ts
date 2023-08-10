import { HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotationEntity } from './entity/notation.entity';
import { CreateNotationDto } from './dtos/createNotationDto';
import { SubjectService } from 'src/subject/subject.service';
import { TopicService } from 'src/topic/topic.service';

@Injectable()
export class NotationService {
  constructor(
    @InjectRepository(NotationEntity)
    private readonly notationRepository: Repository<NotationEntity>,
    @Inject(forwardRef(() => TopicService))
    private readonly topicService: TopicService,
    private readonly subjectService: SubjectService,
  ) {}

  async createByTopicId(
    createNotation: CreateNotationDto,
    userId: number,
  ): Promise<NotationEntity> {
    const { topicId } = createNotation;

    const { subjectId } = await this.topicService.getById(topicId);
    await this.subjectService.getById(subjectId, userId);

    return await this.notationRepository.save(createNotation);
  }

  async deleteByTopicId(topicId: number, userId: number) {
    const { subjectId } = await this.topicService.getById(topicId);

    await this.subjectService.getById(subjectId, userId);

    const notations = await this.getAllNotationsByTopicId(topicId, userId);

    for (const notation of notations) {
      await this.notationRepository.delete({ id: notation.id });
    }

    return HttpStatus.OK;
  }

  async getAllNotationsByTopicId(topicId: number, userId: number) {
    const notation = await this.notationRepository.find({
      where: {
        topicId,
      },
    });

    const { subjectId } = await this.topicService.getById(topicId);

    await this.subjectService.getById(subjectId, userId);

    return notation;
  }
}
