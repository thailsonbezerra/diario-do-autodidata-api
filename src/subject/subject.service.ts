import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SubjectEntity } from './entity/subject.entity';
import { Raw, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSubjectDto } from './dtos/createSubject.dto';
import { UserService } from '../user/user.service';
import { handleOptionalFilterDate } from '../utils/handleOptionalFilterDate';
import { TopicService } from '../topic/topic.service';
import { UpdateSubjectDto } from './dtos/updateSubjectdto';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class SubjectService {
  constructor(
    @InjectRepository(SubjectEntity)
    private readonly subjectRepository: Repository<SubjectEntity>,
    private readonly userService: UserService,
    private readonly topicService: TopicService,
    private readonly cacheService: CacheService,
  ) {}

  async getAllByUserId(
    userId: number,
    statusId?: number,
    dtInicio?: string,
    dtFim?: string,
  ): Promise<SubjectEntity[]> {
    const { dtInicioCondition, dtFimCondition } = handleOptionalFilterDate(
      dtInicio,
      dtFim,
    );

    const createdAt = Raw(
      (alias) =>
        `date(${alias}) BETWEEN '${dtInicioCondition}' AND '${dtFimCondition}'`,
    );

    return await this.subjectRepository.find({
      where: {
        userId,
        createdAt,
        ...(statusId && { statusId }),
      },
    });
  }

  async getByIdUsingRelations(
    subjectId: number,
    userId: number,
  ): Promise<SubjectEntity> {
    const subject = await this.cacheService.getCache<SubjectEntity>(
      `subject_${subjectId}`,
      () =>
        this.subjectRepository.findOne({
          where: {
            id: subjectId,
          },
          relations: {
            topics: {
              notations: true,
            },
            status: true,
          },
        }),
    );

    if (!subject) {
      throw new HttpException(
        `Subject #${subjectId} Not Found`,
        HttpStatus.NOT_FOUND,
      );
    }

    const isUser = subject.userId === userId;
    if (!isUser)
      throw new HttpException(
        `User without access to subject #${subjectId}`,
        HttpStatus.FORBIDDEN,
      );

    return subject;
  }

  async getById(id: number, userId: number) {
    const subject = await this.subjectRepository.findOne({
      where: {
        id,
      },
    });

    if (!subject) {
      throw new HttpException(`Subject #${id} Not Found`, HttpStatus.NOT_FOUND);
    }

    const isUser = subject.userId === userId;
    if (!isUser)
      throw new HttpException(
        `User without access to subject #${id}`,
        HttpStatus.FORBIDDEN,
      );

    return subject;
  }

  async createByUserId(
    createSubject: CreateSubjectDto,
    statusId: number,
    userId: number,
  ): Promise<SubjectEntity> {
    await this.userService.findUserById(userId);
    return this.subjectRepository.save({
      ...createSubject,
      statusId,
      userId,
    });
  }

  async updateById(
    id: number,
    userId: number,
    updateSubject: UpdateSubjectDto,
  ) {
    const subject = await this.getById(id, userId);

    await this.invalidateSubjectCache(id, userId);

    const updateSubjectData = { ...updateSubject, updatedAt: new Date() };

    this.subjectRepository.merge(subject, updateSubjectData);
    return await this.subjectRepository.save(subject);
  }

  async deleteById(id: number, userId: number) {
    await this.getById(id, userId);

    await this.topicService.deleteBySubjectId(id, userId);

    await this.invalidateSubjectCache(id, userId);

    return await this.subjectRepository.delete(id);
  }

  async invalidateSubjectCache(subjectId: number, userId: number) {
    const subject = await this.getByIdUsingRelations(subjectId, userId);
    await this.cacheService.invalidateCache(`subject_${subjectId}`);

    const topics = subject.topics;
    for (const topic of topics) {
      await this.cacheService.invalidateCache(`topic_${topic.id}`);
      const notations = topic.notations;
      for (const notation of notations) {
        await this.cacheService.invalidateCache(`notation_${notation.id}`);
      }
    }
  }
}
