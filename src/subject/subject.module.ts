import { Module } from '@nestjs/common';
import { SubjectController } from './subject.controller';
import { SubjectService } from './subject.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubjectEntity } from './entity/subject.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([SubjectEntity]), UserModule],
  controllers: [SubjectController],
  providers: [SubjectService],
})
export class SubjectModule {}
