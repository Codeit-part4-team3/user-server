import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { EmailDto } from './email.dto';

export class ConfirmSignupDto extends EmailDto {
  @ApiProperty({ description: '코드', type: 'string' })
  @IsString({ message: '코드는 문자열이어야 합니다.' })
  code: string;
}
