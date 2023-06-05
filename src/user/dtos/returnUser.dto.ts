import { ReturnSubjectDto } from 'src/subject/dtos/returnSubject.dto';
import { UserEntity } from '../entity/user.entity';

export class ReturnUserDto {
  id: number;
  name: string;
  email: string;
  cpf: string;
  created: Date;
  subjects?: ReturnSubjectDto[];

  constructor(userEntity: UserEntity) {
    this.id = userEntity.id;
    this.name = userEntity.name;
    this.email = userEntity.email;
    this.cpf = userEntity.cpf;
    this.created = userEntity.createdAt;

    this.subjects = userEntity.subjects
      ? userEntity.subjects.map((subject) => new ReturnSubjectDto(subject))
      : undefined;
  }
}
