import { SubjectEntity } from '../entity/subject.entity';

export class ReturnSubjectDto {
  id: number;
  name: string;
  description: string;
  statusId: number;

  constructor(subjectEntity: SubjectEntity) {
    this.id = subjectEntity.id;
    this.name = subjectEntity.name;
    this.description = subjectEntity.description;
    this.statusId = subjectEntity.statusId;
  }
}
