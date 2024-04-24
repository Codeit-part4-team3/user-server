import { IsEmail } from 'class-validator';

export class EmailDto {
  @IsEmail({}, { message: '유효하지 않은 이메일 주소입니다.' })
  email: string;
}
