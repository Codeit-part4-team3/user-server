import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';
import { FriendOneDto } from './friendOne.dto';

export class UpdateFriendRequest extends FriendOneDto {
  @ApiProperty({ description: '초대 응답', type: 'boolean' })
  @IsBoolean({ message: '필수입니다.' })
  isAccepted: boolean;
}
