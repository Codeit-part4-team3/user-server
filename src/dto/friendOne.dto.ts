import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class FriendOneDto {
  @ApiProperty({ description: '비밀번호', type: 'number' })
  @IsNumber({}, { message: '보낸 사람 아이디는 필수 입니다.' })
  friendId: number;
}
