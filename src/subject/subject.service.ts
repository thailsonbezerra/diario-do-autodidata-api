import { Injectable } from '@nestjs/common';
import { SubjectEntity } from './entity/subject.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSubjectDto } from './dtos/createSubject.dto';

@Injectable()
export class SubjectService {
  constructor(
    @InjectRepository(SubjectEntity)
    private readonly subjectRepository: Repository<SubjectEntity>,
  ) {}

  async create(
    createSubject: CreateSubjectDto,
    statusId: number,
    userId: number,
  ): Promise<SubjectEntity> {
    return this.subjectRepository.save({
      ...createSubject,
      statusId,
      userId,
    });
  }

  async getAll(): Promise<SubjectEntity[]> {
    return await this.subjectRepository.find();
  }
}
