import { Test, TestingModule } from '@nestjs/testing';
import { FriendService } from './friend.service';
import { PrismaService } from '../prisma.service';
import { UserService } from '../user/user.service';

describe('FriendService', () => {
  let service: FriendService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FriendService, PrismaService, UserService],
    }).compile();

    service = module.get<FriendService>(FriendService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
