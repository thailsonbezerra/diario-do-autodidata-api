import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDto } from './dtos/createUser.dto';
import { UserService } from './user.service';
import { UserEntity } from './entity/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() body: CreateUserDto): Promise<UserEntity> {
    return this.userService.create(body);
  }

  @Get()
  async getAllUser(): Promise<UserEntity[]> {
    return this.userService.getAllUser();
  }
}
