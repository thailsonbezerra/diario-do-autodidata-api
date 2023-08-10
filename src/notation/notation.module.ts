import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotationEntity } from './entity/notation.entity';
import { NotationService } from './notation.service';
import { NotationController } from './notation.controller';
import { SubjectModule } from 'src/subject/subject.module';
import { TopicModule } from 'src/topic/topic.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([NotationEntity]),
    forwardRef(() => TopicModule),
    SubjectModule,
  ],
  controllers: [NotationController],
  providers: [NotationService],
  exports: [NotationService],
})
export class NotationModule {}
