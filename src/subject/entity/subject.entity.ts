import { TopicEntity } from '../../topic/entity/topic.entity';
import { UserEntity } from '../../user/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'subjects' })
export class SubjectEntity {
  @PrimaryGeneratedColumn('rowid')
  id: number;

  @Column({ name: 'name', nullable: false })
  name: string;

  @Column({ name: 'description', nullable: false })
  description: string;

  @Column({ name: 'user_id', nullable: false })
  userId: number;

  @Column({ name: 'status_id', nullable: false })
  statusId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.subjects)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserEntity;

  @OneToMany(() => TopicEntity, (topic) => topic.subject)
  topics: TopicEntity[];
}
