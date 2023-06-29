import { UserEntity } from '../../user/entity/user.entity';

export class LoginPayload {
  id: number;
  name: string;

  constructor(user: UserEntity) {
    this.id = user.id;
    this.name = user.name;
  }
}
