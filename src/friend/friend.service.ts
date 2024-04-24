import { Injectable } from '@nestjs/common';
import { SendFriend } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class FriendService {
  constructor(private readonly prismaService: PrismaService) {}
  async sendFriend({
    sendUserId,
    receiveUserId,
  }: {
    sendUserId: number;
    receiveUserId: number;
  }): Promise<SendFriend | null> {
    return this.prismaService.sendFriend.create({
      data: { sendUserId, receiveUserId },
    });
  }
}
