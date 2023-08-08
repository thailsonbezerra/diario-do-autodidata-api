import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SubjectEntity } from './entity/subject.entity';
import { EntityNotFoundError, Raw, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSubjectDto } from './dtos/createSubject.dto';
import { UserService } from '../user/user.service';
import { handleOptionalFilterDate } from 'src/helpers/handleOptionalFilterDate';

@Injectable()
export class SubjectService {
  constructor(
    @InjectRepository(SubjectEntity)
    private readonly subjectRepository: Repository<SubjectEntity>,
    private readonly userService: UserService,
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

  async getById(id: number) {
    return await this.subjectRepository.findOne({
      where: {
        id,
      },
    });
  }
}
