import { Module, forwardRef } from '@nestjs/common';
import { TopicController } from './topic.controller';
import { TopicService } from './topic.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TopicEntity } from './entity/topic.entity';
import { CacheModule } from '../cache/cache.module';
import { SubjectModule } from 'src/subject/subject.module';
import { NotationModule } from 'src/notation/notation.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TopicEntity]),
    forwardRef(() => NotationModule),
    forwardRef(() => SubjectModule),
    CacheModule,
  ],
  controllers: [TopicController],
  providers: [TopicService],
  exports: [TopicService],
})
export class TopicModule {}
