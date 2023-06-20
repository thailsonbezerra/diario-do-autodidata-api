import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { TopicService } from './topic.service';
import { TopicEntity } from './entity/topic.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('topic')
@UseGuards(AuthGuard('jwt'))
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  @Get('/:subjectId')
  async getAllTopicsBySubjectId(
    @Param('subjectId') subjectId: number,
  ): Promise<TopicEntity[]> {
    return await this.topicService.getAllTopicsBySubjectId(subjectId);
  }
}
