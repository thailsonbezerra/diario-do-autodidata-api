import { Injectable, NotFoundException } from '@nestjs/common';
import { SubjectEntity } from './entity/subject.entity';
import { Raw, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSubjectDto } from './dtos/createSubject.dto';
import { UserService } from '../user/user.service';
import { handleOptionalFilterDate } from '../utils/handleOptionalFilterDate';
import { TopicService } from 'src/topic/topic.service';
import { UpdateSubjectDto } from './dtos/updateSubjectdto';

@Injectable()
export class SubjectService {
  constructor(
    @InjectRepository(SubjectEntity)
    private readonly subjectRepository: Repository<SubjectEntity>,
    private readonly userService: UserService,
    private readonly topicService: TopicService,
  ) {}

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

  async getAllByUserId(
    userId: number,
    statusId: number,
    dtInicio: string,
    dtFim: string,
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
    const subject = await this.subjectRepository.findOne({
      where: {
        id: subjectId,
        userId,
      },
      relations: {
        topics: {
          notations: true,
        },
        status: true,
      },
    });

    if (!subject) {
      throw new NotFoundException(`SubjectId: ${subjectId} Not Found`);
    }

    return subject;
  }

  async getById(id: number, userId: number) {
    const subject = await this.subjectRepository.findOne({
      where: {
        id,
      },
    });

    if (!subject) throw new NotFoundException(`SubjectId: ${id} Not Found`);

    const isUser = subject.userId === userId;
    if (!isUser)
      throw new NotFoundException(
        `Subject Not Found by SubjectId: ${id} for that user`,
      );

    return subject;
  }

  async deleteById(id: number, userId: number) {
    await this.getById(id, userId);

    await this.topicService.deleteBySubjectId(id, userId);

    return await this.subjectRepository.delete(id);
  }

  async updateById(
    id: number,
    userId: number,
    updateSubject: UpdateSubjectDto,
  ) {
    await this.getById(id, userId);

    return await this.subjectRepository.update(
      { id },
      { ...updateSubject, updatedAt: new Date() },
    );
  }
}
