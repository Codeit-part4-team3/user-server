import { Test, TestingModule } from '@nestjs/testing';
import { FriendController } from './friend.controller';
import { PrismaService } from './../prisma.service';
import { FriendService } from './friend.service';
import { UserService } from '../user/user.service';
import { AuthService } from '../auth/auth.service';
import { LoggerModule } from './../common/logger/logger.module';

describe('FriendController', () => {
  let controller: FriendController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      controllers: [FriendController],
      providers: [PrismaService, FriendService, UserService, AuthService],
    }).compile();

    controller = module.get<FriendController>(FriendController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
