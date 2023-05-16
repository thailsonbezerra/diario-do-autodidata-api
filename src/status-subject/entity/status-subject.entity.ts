import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'status_subject' })
export class StatusSubjectEntity {
  @PrimaryGeneratedColumn('rowid')
  id: number;

  @Column({ name: 'name', nullable: false })
  name: string;

  @Column({ name: 'color', nullable: false })
  color: string;
}
