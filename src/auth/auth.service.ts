import { Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity } from '../user/entity/user.entity';
import { UserService } from '../user/user.service';
import { loginDto } from './dtos/login.dto';
import { ReturnLogin } from './dtos/returnLogin.dto';
import { ReturnUserDto } from '../user/dtos/returnUser.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginPayload } from './dtos/loginPayload.dto';
import { validatePassword } from 'src/utils/password';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: loginDto): Promise<ReturnLogin> {
    const user: UserEntity | undefined = await this.userService
      .findUserByEmail(loginDto.email)
      .catch(() => undefined);

    const isMatch = await validatePassword(
      loginDto.password,
      user?.password || '',
    );

    if (!user || !isMatch) {
      throw new NotFoundException('Email or password invalid');
    }

    return {
      accessToken: await this.jwtService.signAsync({
        ...new LoginPayload(user),
      }),
      user: new ReturnUserDto(user),
    };
  }
}
