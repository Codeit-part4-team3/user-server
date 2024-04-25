import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class EmailDto {
  @ApiProperty({ description: '이메일.', type: 'string' })
  @IsEmail({}, { message: '유효하지 않은 이메일 주소입니다.' })
  email: string;
}
