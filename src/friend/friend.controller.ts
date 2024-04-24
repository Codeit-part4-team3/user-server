import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { FriendService } from './friend.service';
import { UserService } from '../user/user.service';

@Controller('api/user/v1/friend')
export class FriendController {
  private readonly friendService: FriendService;
  private readonly userService: UserService;
  constructor() {}
  @Get()
  test() {
    return 'hello';
  }

  @Post('send')
  async sendFriend(@Body() data) {
    const { email, userId } = data;

    if (!email || !userId) {
      throw new HttpException(
        '이메일 혹은 유저 아이디는 필수입니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const owner = await this.userService.getUser({ id: userId });
      const friend = await this.userService.getUser({ email });

      if (!owner || !friend) {
        throw new HttpException('없는 유저입니다.', HttpStatus.NOT_FOUND);
      }

      const res = await this.friendService.sendFriend({
        sendUserId: owner.id,
        receiveUserId: friend.id,
      });

      return res;
    } catch (e) {
      return e;
    }
  }
}
