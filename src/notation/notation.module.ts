import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotationEntity } from './entity/notation.entity';
import { NotationService } from './notation.service';
import { NotationController } from './notation.controller';
import { SubjectModule } from '../subject/subject.module';
import { TopicModule } from '../topic/topic.module';
import { CacheModule } from '../cache/cache.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([NotationEntity]),
    forwardRef(() => TopicModule),
    SubjectModule,
    CacheModule,
  ],
  controllers: [NotationController],
  providers: [NotationService],
  exports: [NotationService],
})
export class NotationModule {}
