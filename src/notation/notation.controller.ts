import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { NotationEntity } from './entity/notation.entity';
import { NotationService } from './notation.service';
import { CreateNotationDto } from './dtos/createNotationDto';
import { UserLogado } from '../decorators/user-logado.decorator';
import { LoginPayload } from '../auth/dtos/loginPayload.dto';
import { ReturnNotationDto } from './dtos/returnNotation.dto';
import { UpdateNotationDto } from './dtos/updateNotationDto';
import { ReturnNotationUpdatedDto } from './dtos/returnNotationUpdated.dto';

@Controller('notation')
@UseGuards(AuthGuard('jwt'))
export class NotationController {
  constructor(private readonly notationService: NotationService) {}

  @Post()
  async createTopicNotation(
    @Body() createNotation: CreateNotationDto,
    @UserLogado() userLogado: LoginPayload,
  ): Promise<NotationEntity> {
    return await this.notationService.createByTopicId(
      createNotation,
      +userLogado.id,
    );
  }

  @Get('/topic/:topicId')
  async getAllNotationsByTopicId(
    @UserLogado() userLogado: LoginPayload,
    @Param('topicId') topicId: number,
  ): Promise<NotationEntity[]> {
    return await this.notationService.getAllNotationsByTopicId(
      +topicId,
      +userLogado.id,
    );
  }

  @Get('/:id')
  async getById(
    @UserLogado() userLogado: LoginPayload,
    @Param('id') id: number,
  ) {
    const notation = await this.notationService.getById(+id, +userLogado.id);

    return new ReturnNotationDto(notation);
  }

  @Delete('/:id')
  async deleteById(
    @UserLogado() userLogado: LoginPayload,
    @Param('id') id: number,
  ) {
    return await this.notationService.deleteById(+id, +userLogado.id);
  }

  @UsePipes(ValidationPipe)
  @Put('/:id')
  async updateById(
    @UserLogado() userLogado: LoginPayload,
    @Param('id') id: number,
    @Body() updateNotation: UpdateNotationDto,
  ) {
    const notation = await this.notationService.updateById(
      +id,
      +userLogado.id,
      updateNotation,
    );

    return new ReturnNotationUpdatedDto(notation);
  }
}
