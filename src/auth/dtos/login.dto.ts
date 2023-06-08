import { IsString } from 'class-validator';

export class loginDto {
  @IsString()
  email: string;

  @IsString()
  password: string;
}
