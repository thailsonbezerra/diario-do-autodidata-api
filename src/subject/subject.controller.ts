import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SubjectService } from './subject.service';
import { SubjectEntity } from './entity/subject.entity';
import { CreateSubjectDto } from './dtos/createSubject.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserLogado } from 'src/decorators/user-logado.decorator';
import { LoginPayload } from 'src/auth/dtos/loginPayload.dto';

const STATUS_SUBJECT_INICIAL = 1;

@Controller('subject')
@UseGuards(AuthGuard('jwt'))
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createSubject(
    @Body() createSubject: CreateSubjectDto,
    @UserLogado() userLogado: LoginPayload,
  ): Promise<SubjectEntity> {
    return this.subjectService.create(
      createSubject,
      STATUS_SUBJECT_INICIAL,
      userLogado.id,
    );
  }

  @Get()
  async getAllSubject(): Promise<SubjectEntity[]> {
    return await this.subjectService.getAll();
  }
}
