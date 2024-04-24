import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma.service';
import { SendFriendDto } from './../dto/sendFriend.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class FriendService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
  ) {}

  async sendFriend(sendFriendDto: SendFriendDto) {
    const { email, userId } = sendFriendDto;

    if (!email || !userId) {
      throw new HttpException(
        '이메일 혹은 유저 아이디는 필수입니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const owner = await this.userService.getUserById(userId);
      const friend = await this.userService.getUserByEmail(email);

      if (!owner || !friend) {
        throw new HttpException('없는 유저입니다.', HttpStatus.NOT_FOUND);
      }

      if (owner.id === friend.id) {
        throw new HttpException('본인입니다..', HttpStatus.NOT_FOUND);
      }

      return await this.prismaService.sendFriend.create({
        data: { sendUserId: owner.id, receiveUserId: friend.id },
      });
    } catch (e) {
      if (e.code === 'P2002') {
        throw new HttpException('이미 요청하셨습니다.', HttpStatus.CONFLICT);
      }

      throw new HttpException(e.response, e.status);
    }
  }
}
