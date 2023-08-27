import { Module } from '@nestjs/common';
import { SubjectController } from './subject.controller';
import { SubjectService } from './subject.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubjectEntity } from './entity/subject.entity';
import { UserModule } from '../user/user.module';
import { StatusSubjectModule } from '../status-subject/status-subject.module';
import { TopicModule } from '../topic/topic.module';
import { CacheModule } from '../cache/cache.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SubjectEntity]),
    TopicModule,
    UserModule,
    StatusSubjectModule,
    CacheModule,
  ],
  controllers: [SubjectController],
  providers: [SubjectService],
  exports: [SubjectService],
})
export class SubjectModule {}
