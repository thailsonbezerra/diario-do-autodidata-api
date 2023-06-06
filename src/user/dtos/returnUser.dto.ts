import { ReturnSubjectDto } from 'src/subject/dtos/returnSubject.dto';
import { UserEntity } from '../entity/user.entity';

export class ReturnUserDto {
  id: number;
  name: string;
  email: string;
  cpf: string;
  created: Date;
  subjects?: ReturnSubjectDto[];

  constructor(user: UserEntity) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.cpf = user.cpf;
    this.created = user.createdAt;

    this.subjects = user.subjects
      ? user.subjects.map((subject) => new ReturnSubjectDto(subject))
      : undefined;
  }
}
