import { IsString } from 'class-validator';
import { EmailDto } from './email.dto';

export class ConfirmSignupDto extends EmailDto {
  @IsString({ message: '비밀번호는 문자열이어야 합니다.' })
  code: string;
}
