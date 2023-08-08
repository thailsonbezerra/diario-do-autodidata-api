import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { NotationEntity } from './entity/notation.entity';
import { NotationService } from './notation.service';
import { CreateNotationDto } from './dtos/createNotationDto';
import { UserLogado } from 'src/decorators/user-logado.decorator';
import { LoginPayload } from 'src/auth/dtos/loginPayload.dto';

@Controller('notation')
@UseGuards(AuthGuard('jwt'))
export class NotationController {
  constructor(private readonly notationService: NotationService) {}

  @Post()
  async createTopicNotation(
    @Body() createNotation: CreateNotationDto,
  ): Promise<NotationEntity> {
    return await this.notationService.createByTopicId(createNotation);
  }

  @Get('/:topicId')
  async getAllNotationsByTopicId(
    @UserLogado() userLogado: LoginPayload,
    @Param('topicId') topicId: number,
  ): Promise<NotationEntity[]> {
    return await this.notationService.getAllNotationsByTopicId(
      +topicId,
      +userLogado.id,
    );
  }
}
