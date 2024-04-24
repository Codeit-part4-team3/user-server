import { IsString } from 'class-validator';
import { LoginDto } from './login.dto';

export class SignupDto extends LoginDto {
  @IsString({ message: '닉네임은 필수입니다.' })
  nickname: string;
}
