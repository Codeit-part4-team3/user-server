import { IsString, Length } from 'class-validator';
import { EmailDto } from './email.dto';

export class LoginDto extends EmailDto {
  @IsString({ message: '비밀번호는 필수입니다.' })
  @Length(8, 20, { message: '비밀번호는 8자 이상 20자 이하이어야 합니다.' })
  password: string;
}
