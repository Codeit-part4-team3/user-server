import { IsBoolean } from 'class-validator';
import { FriendOneDto } from './friendOne.dto';

export class UpdateFriendRequest extends FriendOneDto {
  @IsBoolean({ message: '필수입니다.' })
  isAccepted: boolean;
}
