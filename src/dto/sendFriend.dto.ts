import { IsNumber } from 'class-validator';
import { EmailDto } from './email.dto';

export class SendFriendDto extends EmailDto {
  @IsNumber({}, { message: '받는 유저아이디는 숫자형이어야 합니다.' })
  userId: number;
}
