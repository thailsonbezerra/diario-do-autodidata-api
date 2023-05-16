import { Controller, Get } from '@nestjs/common';
import { SubjectService } from './subject.service';
import { SubjectEntity } from './entity/subject.entity';

@Controller('subject')
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  @Get()
  async getAllSubject(): Promise<SubjectEntity[]> {
    return await this.subjectService.getAll();
  }
}
