import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SubjectService } from './subject.service';
import { SubjectEntity } from './entity/subject.entity';
import { CreateSubjectDto } from './dtos/createSubject.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserLogado } from '../decorators/user-logado.decorator';
import { LoginPayload } from '../auth/dtos/loginPayload.dto';
import { returnAllFromSubject } from './dtos/returnAllFromSubject';

const STATUS_SUBJECT_INICIAL = 1;

@Controller('subject')
@UseGuards(AuthGuard('jwt'))
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createUserSubject(
    @Body() createSubject: CreateSubjectDto,
    @UserLogado() userLogado: LoginPayload,
  ): Promise<SubjectEntity> {
    return this.subjectService.createByUserId(
      createSubject,
      STATUS_SUBJECT_INICIAL,
      userLogado.id,
    );
  }

  @Get()
  async getAllUserSubjects(
    @UserLogado() userLogado: LoginPayload,
    @Query('statusId') statusId?: number,
    @Query('dtInicio') dtInicio?: string,
    @Query('dtFim') dtFim?: string,
  ): Promise<SubjectEntity[]> {
    return await this.subjectService.getAllByUserId(
      userLogado.id,
      +statusId,
      dtInicio,
      dtFim,
    );
  }

  @Get('/:subjectId')
  async getAllFromSubjectById(
    @UserLogado() userLogado: LoginPayload,
    @Param('subjectId') subjectId: number,
  ) {
    const subject = await this.subjectService.getByIdUsingRelations(
      +subjectId,
      userLogado.id,
    );

    return {
      ...new returnAllFromSubject(subject),
      situation: subject.status.name,
    };
  }
}
