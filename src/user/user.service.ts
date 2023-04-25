import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dtos/createUser.dto';
import { User } from './interfaces/user.interface';
import { hash } from 'bcrypt';

@Injectable()
export class UserService {
  private users: User[] = [];

  async create(data: CreateUserDto): Promise<User> {
    const saltOrRounds = 10;

    const passwordHashed = await hash(data.password, saltOrRounds);

    const user: User = {
      ...data,
      id: this.users.length + 1,
      password: passwordHashed,
    };
    this.users.push(user);

    return user;
  }

  async getAllUser(): Promise<User[]> {
    return this.users;
  }
}
