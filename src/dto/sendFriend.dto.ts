import { IsNumber } from 'class-validator';
import { EmailDto } from './email.dto';

export class SendFriendDto extends EmailDto {
  @IsNumber({}, { message: '아이디는 필수 입니다.' })
  userId: number;
}
