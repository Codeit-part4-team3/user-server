import { Body, Controller, Get, Post } from '@nestjs/common';
import { FriendService } from './friend.service';

import { SendFriendDto } from './../dto/sendFriend.dto';

@Controller('api/user/v1/friend')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}
  @Get()
  test() {
    return 'hello';
  }

  @Post('send')
  async sendFriend(@Body() sendFriendDto: SendFriendDto) {
    return await this.friendService.sendFriend(sendFriendDto);
  }
}
