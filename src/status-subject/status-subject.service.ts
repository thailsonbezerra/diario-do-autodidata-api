import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StatusSubjectEntity } from './entity/status-subject.entity';

@Injectable()
export class StatusSubjectService {
  constructor(
    @InjectRepository(StatusSubjectEntity)
    private readonly statusSubjectRepository: Repository<StatusSubjectEntity>,
  ) {}

  async getNameStatusById(statusId: number) {
    return await this.statusSubjectRepository.findOne({
      where: {
        id: statusId,
      },
    });
  }
}
