import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma.service';
import { UserService } from '../user/user.service';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from '../common/logger/logger.module';
import { generateUniqueEmail } from './../util/generateUniqueEmail';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule, LoggerModule],
      controllers: [AuthController],
      providers: [AuthService, PrismaService, UserService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('회원가입 테스트', async () => {
    const res = await controller.signUp({
      email: generateUniqueEmail(),
      nickname: 'test',
      password: 'sprint101',
    });
    expect(res).toBeUndefined();
  });
});
