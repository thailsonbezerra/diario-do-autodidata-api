import { Module } from '@nestjs/common';
import { SubjectController } from './subject.controller';
import { SubjectService } from './subject.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubjectEntity } from './entity/subject.entity';
import { UserModule } from '../user/user.module';
import { StatusSubjectModule } from '../status-subject/status-subject.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SubjectEntity]),
    UserModule,
    StatusSubjectModule,
  ],
  controllers: [SubjectController],
  providers: [SubjectService],
  exports: [SubjectService],
})
export class SubjectModule {}
