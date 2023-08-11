import { IsNumber, IsString } from 'class-validator';

export class UpdateSubjectDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  statusId: number;
}
