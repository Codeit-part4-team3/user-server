import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { LoginDto } from './login.dto';

export class SignupDto extends LoginDto {
  @ApiProperty({ description: '닉네임', type: 'string' })
  @IsString({ message: '닉네임은 필수입니다.' })
  nickname: string;
}
