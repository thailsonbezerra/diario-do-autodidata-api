import { IsString } from 'class-validator';

export class UpdateNotationDto {
  @IsString()
  annotation: string;
}
