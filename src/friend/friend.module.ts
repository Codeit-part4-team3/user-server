import { Module } from '@nestjs/common';
import { FriendService } from './friend.service';
import { UserService } from 'src/user/user.service';
import { FriendController } from './friend.controller';
import { PrismaService } from '../prisma.service';
import { AuthService } from './../auth/auth.service';

@Module({
  controllers: [FriendController],
  providers: [FriendService, UserService, PrismaService, AuthService],
})
export class FriendModule {}
