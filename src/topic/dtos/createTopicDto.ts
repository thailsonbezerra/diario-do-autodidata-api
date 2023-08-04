import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateTopicDto {
  @IsString()
  name: string;

  @IsBoolean()
  status: boolean;

  @IsNumber()
  subjectId: number;
}
