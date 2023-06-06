import { NotationEntity } from 'src/notation/entity/notation.entity';
import { SubjectEntity } from 'src/subject/entity/subject.entity';
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

@Entity({ name: 'topics' })
export class TopicEntity {
  @PrimaryGeneratedColumn('rowid')
  id: number;

  @Column({ name: 'name', nullable: false })
  name: string;

  @Column({ name: 'status', nullable: false })
  status: boolean;

  @Column({ name: 'subject_id', nullable: false })
  subjectId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => SubjectEntity, (subject) => subject.topics)
  @JoinColumn({ name: 'subject_id', referencedColumnName: 'id' })
  subject: SubjectEntity;

  @OneToMany(() => NotationEntity, (notation) => notation.topic)
  notations: NotationEntity[];
}
