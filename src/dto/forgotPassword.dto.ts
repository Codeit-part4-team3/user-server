import { IsString, Length } from 'class-validator';
import { ConfirmSignupDto } from './confirmSignup.dto';

export class ForgotPasswordDto extends ConfirmSignupDto {
  @IsString({ message: '비밀번호는 문자열이어야 합니다.' })
  @Length(8, 20, { message: '비밀번호는 8자 이상 20자 이하이어야 합니다.' })
  newPassword: string;
}
