import { Injectable, NotFoundException } from '@nestjs/common';
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
    const status = await this.statusSubjectRepository.findOne({
      where: {
        id: statusId,
      },
    });

    if (!status) {
      throw new NotFoundException(`SubjectId: ${statusId} Not Found`);
    }

    return status;
  }
}
