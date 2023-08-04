import * as moment from 'moment';
import { NotationEntity } from '../entity/notation.entity';

export class ReturnNotationDto {
  id: number;
  annotation: string;
  momentWritten: string;

  constructor(notation: NotationEntity) {
    this.id = notation.id;
    this.annotation = notation.annotation;
    this.momentWritten = moment(notation.createdAt)
      .format('DD/MM/YYYY à HH:mm:SS')
      .replace('à', 'às');
  }
}
