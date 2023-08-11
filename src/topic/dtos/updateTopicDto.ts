import { IsBoolean, IsString } from 'class-validator';

export class UpdateTopicDto {
  @IsString()
  name: string;

  @IsBoolean()
  status: boolean;
}
