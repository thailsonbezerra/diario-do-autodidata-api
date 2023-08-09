import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { TopicService } from './topic.service';
import { TopicEntity } from './entity/topic.entity';
import { AuthGuard } from '@nestjs/passport';
import { CreateTopicDto } from './dtos/createTopicDto';
import { UserLogado } from 'src/decorators/user-logado.decorator';
import { LoginPayload } from 'src/auth/dtos/loginPayload.dto';

@Controller('topic')
@UseGuards(AuthGuard('jwt'))
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  @Post()
  async createSubjectTopic(
    @Body() createTopic: CreateTopicDto,
    @UserLogado() userLogado: LoginPayload,
  ): Promise<TopicEntity> {
    return await this.topicService.createBySubjectId(
      createTopic,
      +userLogado.id,
    );
  }

  @Get('/:subjectId')
  async getAllTopicsBySubjectId(
    @Param('subjectId') subjectId: number,
    @UserLogado() userLogado: LoginPayload,
  ): Promise<TopicEntity[]> {
    return await this.topicService.getAllTopicsBySubjectId(
      subjectId,
      +userLogado.id,
    );
  }
}
