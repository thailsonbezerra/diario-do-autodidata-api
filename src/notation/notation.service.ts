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
import { SubjectService } from 'src/subject/subject.service';
import { TopicService } from 'src/topic/topic.service';
import { UpdateNotationDto } from './dtos/updateNotationDto';

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

    const { subjectId } = await this.topicService.getById(topicId, userId);
    await this.subjectService.getById(subjectId, userId);

    return await this.notationRepository.save(createNotation);
  }

  async deleteByTopicId(topicId: number, userId: number) {
    const { subjectId } = await this.topicService.getById(topicId, userId);

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

    const { subjectId } = await this.topicService.getById(topicId, userId);

    await this.subjectService.getById(subjectId, userId);

    return notation;
  }

  async getById(id: number, userId: number) {
    const notation = await this.notationRepository.findOne({
      where: { id },
      relations: {
        topic: {
          subject: {
            user: true,
          },
        },
      },
    });

    if (!notation) {
      throw new NotFoundException(`NotationId: ${id} Not Found`);
    }

    if (notation.topic.subject.userId !== userId) {
      throw new NotFoundException(`NotationId: ${id} Not Found for that user`);
    }

    return notation;
  }

  async deleteById(id: number, userId: number) {
    await this.getById(id, userId);

    return await this.notationRepository.delete(id);
  }

  async updateById(
    id: number,
    userId: number,
    updateNotation: UpdateNotationDto,
  ) {
    await this.getById(id, userId);

    return await this.notationRepository.update(
      { id },
      { ...updateNotation, updatedAt: new Date() },
    );
  }
}
