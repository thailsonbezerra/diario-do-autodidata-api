import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatusSubjectEntity } from './entity/status-subject.entity';
import { StatusSubjectService } from './status-subject.service';

@Module({
  imports: [TypeOrmModule.forFeature([StatusSubjectEntity])],
  controllers: [],
  providers: [StatusSubjectService],
  exports: [StatusSubjectService],
})
export class StatusSubjectModule {}
