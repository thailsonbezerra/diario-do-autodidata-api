import { IsNumber, IsString } from 'class-validator';

export class CreateNotationDto {
  @IsString()
  annotation: string;

  @IsNumber()
  topicId: number;
}
