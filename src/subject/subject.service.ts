import { Injectable } from '@nestjs/common';
import { SubjectEntity } from './entity/subject.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SubjectService {
  constructor(
    @InjectRepository(SubjectEntity)
    private readonly subjectRepository: Repository<SubjectEntity>,
  ) {}

  async getAll(): Promise<SubjectEntity[]> {
    return await this.subjectRepository.find();
  }
}
