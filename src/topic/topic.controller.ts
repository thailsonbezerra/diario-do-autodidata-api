import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TopicService } from './topic.service';
import { TopicEntity } from './entity/topic.entity';
import { AuthGuard } from '@nestjs/passport';
import { CreateTopicDto } from './dtos/createTopicDto';
import { UserLogado } from 'src/decorators/user-logado.decorator';
import { LoginPayload } from 'src/auth/dtos/loginPayload.dto';
import { ReturnTopicDto } from './dtos/returnTopic.dto';

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

  @Get('/subject/:subjectId')
  async getAllTopicsBySubjectId(
    @Param('subjectId') subjectId: number,
    @UserLogado() userLogado: LoginPayload,
  ): Promise<TopicEntity[]> {
    return await this.topicService.getAllTopicsBySubjectId(
      subjectId,
      +userLogado.id,
    );
  }

  @Get('/:id')
  async getById(
    @Param('id') id: number,
    @UserLogado() userLogado: LoginPayload,
  ) {
    const topic = await this.topicService.getById(+id, +userLogado.id);

    return new ReturnTopicDto(topic);
  }

  @Delete('/:id')
  async deleteById(
    @Param('id') id: number,
    @UserLogado() userLogado: LoginPayload,
  ) {
    return await this.topicService.deleteById(+id, +userLogado.id);
  }
}
