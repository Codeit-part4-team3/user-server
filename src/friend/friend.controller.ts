import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { FriendService } from './friend.service';

import { SendFriendDto } from './../dto/sendFriend.dto';
import { UpdateFriendRequest } from './../dto/updateFriendRequset.dto';

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

  @Get('receive/:id')
  async getReceiveFriendRequest(@Param('id') id) {
    return await this.friendService.getReceiveFriendRequest(+id);
  }

  @Put('accepted')
  async updateFriendRequest(@Body() updateFriendRequest: UpdateFriendRequest) {
    await this.friendService.updateFriendRequest(updateFriendRequest);
  }

  @Get('list/:id')
  async getFriendList(@Param('id') id) {
    return await this.friendService.getFriendList(+id);
  }
}
