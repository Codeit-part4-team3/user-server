import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class StateDto {
  @ApiProperty({ description: '상태', type: 'string' })
  @IsString({ message: '필수입니다.' })
  state: string;
}
