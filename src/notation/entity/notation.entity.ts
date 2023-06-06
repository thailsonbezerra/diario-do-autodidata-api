import { TopicEntity } from 'src/topic/entity/topic.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'notations' })
export class NotationEntity {
  @PrimaryGeneratedColumn('rowid')
  id: number;

  @Column({ name: 'annotation', nullable: false })
  annotation: string;

  @Column({ name: 'topic_id', nullable: false })
  topicId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => TopicEntity, (topic) => topic.notations)
  @JoinColumn({ name: 'topic_id', referencedColumnName: 'id' })
  topic: TopicEntity;
}
