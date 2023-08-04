import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { TopicService } from './topic.service';
import { TopicEntity } from './entity/topic.entity';
import { AuthGuard } from '@nestjs/passport';
import { CreateTopicDto } from './dtos/createTopicDto';

@Controller('topic')
@UseGuards(AuthGuard('jwt'))
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  @Post()
  async createSubjectTopic(
    @Body() createTopic: CreateTopicDto,
  ): Promise<TopicEntity> {
    return await this.topicService.createBySubjectId(createTopic);
  }

  @Get('/:subjectId')
  async getAllTopicsBySubjectId(
    @Param('subjectId') subjectId: number,
  ): Promise<TopicEntity[]> {
    return await this.topicService.getAllTopicsBySubjectId(subjectId);
  }
}
