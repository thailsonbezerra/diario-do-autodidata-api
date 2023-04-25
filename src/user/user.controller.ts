import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDto } from './dtos/createUser.dto';

@Controller('user')
export class UserController {
  @Get()
  async getAllUsers() {
    return JSON.stringify({ test: 'abc' });
  }
  @Post()
  async create(@Body() body: CreateUserDto) {
    return {
      ...body,
      password: undefined,
    };
  }
}
