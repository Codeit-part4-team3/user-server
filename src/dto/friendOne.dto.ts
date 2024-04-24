import { IsNumber } from 'class-validator';

export class FriendOneDto {
  @IsNumber({}, { message: '유저 아이디는 필수 입니다.' })
  userId: number;

  @IsNumber({}, { message: '보낸 사람 아이디는 필수 입니다.' })
  friendId: number;
}
