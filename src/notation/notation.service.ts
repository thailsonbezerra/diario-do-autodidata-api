import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotationEntity } from './entity/notation.entity';
import { CreateNotationDto } from './dtos/createNotationDto';

@Injectable()
export class NotationService {
  constructor(
    @InjectRepository(NotationEntity)
    private readonly notationRepository: Repository<NotationEntity>,
  ) {}

  async createByTopicId(
    createNotation: CreateNotationDto,
  ): Promise<NotationEntity> {
    return await this.notationRepository.save(createNotation);
  }

  async getAllNotationsByTopicId(topicId: number) {
    return await this.notationRepository.find({
      where: {
        topicId,
      },
    });
  }
}
