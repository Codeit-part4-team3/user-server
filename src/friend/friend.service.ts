import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma.service';
import { SendFriendDto } from './../dto/sendFriend.dto';
import { UserService } from '../user/user.service';
import { FriendOneDto } from './../dto/friendOne.dto';
import { UpdateFriendRequest } from './../dto/updateFriendRequset.dto';

@Injectable()
export class FriendService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
  ) {}

  // 친구요청 보내기
  async sendFriend(sendFriendDto: SendFriendDto) {
    const { email, userId } = sendFriendDto;

    try {
      const owner = await this.userService.getUserById(userId);
      const friend = await this.userService.getUserByEmail(email);

      if (owner.id === friend.id) {
        throw new HttpException('본인입니다.', HttpStatus.BAD_REQUEST);
      }

      const res = await this.prismaService.friendList.findUnique({
        where: {
          userId_friendId: {
            userId: owner.id,
            friendId: friend.id,
          },
        },
      });

      if (res) {
        throw new HttpException('이미 친구입니다.', HttpStatus.CONFLICT);
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

  // 받은 친구 요청 보기(전체) - 나중에 페이지 네이션 구현할듯?
  async getReceiveFriendRequest(id: number) {
    await this.userService.getUserById(id);

    const res = await this.prismaService.sendFriend.findMany({
      where: { receiveUserId: id },
    });

    // map으로 id => userInfo 변환 (value에 null 또는 유저정보 들어감)
    const ReceiveFriendList = await Promise.allSettled(
      res.map(async (user) => {
        try {
          return await this.userService.getUserById(user.sendUserId);
        } catch (_) {
          return null;
        }
      }),
    );

    // 유저 정보 클라이언트에서 사용하기 편하게 map과 filter 사용
    return ReceiveFriendList.map((result) => result['value']).filter(
      (result) => result !== null,
    );
  }

  // 요청 목록에서 일치하는 값 삭제
  async deleteFriendRequest(friendOneDto: FriendOneDto) {
    const { friendId, userId } = friendOneDto;

    try {
      await this.prismaService.sendFriend.delete({
        where: {
          sendUserId_receiveUserId: {
            sendUserId: friendId,
            receiveUserId: userId,
          },
        },
      });
    } catch (e) {
      throw new HttpException('삭제하는데 실패했습니다.', HttpStatus.CONFLICT);
    }
  }

  // 친구 추가
  async addFriend(friendOneDto: FriendOneDto) {
    const { userId, friendId } = friendOneDto;

    // 존재하는지 체크
    await this.userService.getUserById(userId);
    await this.userService.getUserById(friendId);

    try {
      await this.prismaService.friendList.create({
        data: { userId, friendId },
      });

      await this.prismaService.friendList.create({
        data: { userId: friendId, friendId: userId },
      });
    } catch (e) {
      throw new HttpException('이미 친구입니다.', HttpStatus.CONFLICT);
    }
  }

  // 친구 요청 응답
  async updateFriendRequest(updateFriendRequest: UpdateFriendRequest) {
    const { userId, friendId, isAccepted } = updateFriendRequest;

    if (isAccepted) {
      await this.addFriend({ userId, friendId });
    }

    await this.deleteFriendRequest({ userId, friendId });
  }

  // 친구목록 모두 불러오기
  async getFriendList(id: number) {
    await this.userService.getUserById(id);

    const res = await this.prismaService.friendList.findMany({
      where: { userId: id },
    });

    const ReceiveFriendList = await Promise.allSettled(
      res.map(async (user) => {
        try {
          return await this.userService.getUserById(user.friendId);
        } catch (_) {
          return null;
        }
      }),
    );
    return ReceiveFriendList.map((result) => result['value']).filter(
      (result) => result !== null,
    );
  }
}
