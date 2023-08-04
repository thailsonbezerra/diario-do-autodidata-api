import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotationEntity } from './entity/notation.entity';
import { NotationService } from './notation.service';
import { NotationController } from './notation.controller';

@Module({
  imports: [TypeOrmModule.forFeature([NotationEntity])],
  controllers: [NotationController],
  providers: [NotationService],
})
export class NotationModule {}
