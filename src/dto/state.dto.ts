import { IsString } from 'class-validator';

export class StateDto {
  @IsString({ message: '필수입니다.' })
  state: string;
}
