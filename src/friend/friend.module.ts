import { Module } from '@nestjs/common';
import { FriendService } from './friend.service';

@Module({
  providers: [FriendService],
})
export class FriendModule {}
