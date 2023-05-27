import { Module } from '@nestjs/common';
import { TopicController } from './topic.controller';
import { TopicService } from './topic.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TopicEntity } from './entity/topic.entity';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [CacheModule.register(), TypeOrmModule.forFeature([TopicEntity])],
  controllers: [TopicController],
  providers: [TopicService],
})
export class TopicModule {}
