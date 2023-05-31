import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SubjectService } from './subject.service';
import { SubjectEntity } from './entity/subject.entity';
import { CreateSubjectDto } from './dtos/createSubject.dto';

const STATUS_SUBJECT_INICIAL = 1;

@Controller('subject')
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  @Post('/:userId')
  @UsePipes(ValidationPipe)
  async createSubject(
    @Body() createSubject: CreateSubjectDto,
    @Param('userId') userId: number,
  ): Promise<SubjectEntity> {
    return this.subjectService.create(
      createSubject,
      STATUS_SUBJECT_INICIAL,
      userId,
    );
  }

  @Get()
  async getAllSubject(): Promise<SubjectEntity[]> {
    return await this.subjectService.getAll();
  }
}
