import { Injectable, NotFoundException } from '@nestjs/common';
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
    private readonly subjectService: SubjectService,
    private readonly topicService: TopicService,
  ) {}

  async createByTopicId(
    createNotation: CreateNotationDto,
    userId: number,
  ): Promise<NotationEntity> {
    const { topicId } = createNotation;

    const { subjectId } = await this.topicService.getById(topicId);
    const subject = await this.subjectService.getById(subjectId, userId);

    return await this.notationRepository.save(createNotation);
  }

  async getAllNotationsByTopicId(topicId: number, userId: number) {
    const notation = await this.notationRepository.find({
      where: {
        topicId,
      },
    });

    const { subjectId } = await this.topicService.getById(topicId);

    const subject = await this.subjectService.getById(subjectId, userId);

    return notation;
  }
}
