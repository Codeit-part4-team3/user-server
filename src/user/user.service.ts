import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User } from '@prisma/client';
import { SignupDto } from 'src/dto/signup.dto';
import { StateDto } from './../dto/state.dto';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async getUserById(id: number) {
    if (!id) {
      throw new HttpException('id는 필수 입니다.', HttpStatus.NOT_FOUND);
    }

    const user = await this.prismaService.user.findUnique({
      where: { id },
      include: {
        state: true, // State 정보 포함
      },
    });

    if (!user) {
      throw new HttpException(
        '존재하지 않는 유저입니다.',
        HttpStatus.NOT_FOUND,
      );
    }

    const userInfo = {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      state: user.state.name || null,
    };

    return userInfo;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    if (!email) {
      throw new HttpException('email은 필수 입니다.', HttpStatus.NOT_FOUND);
    }

    const user = await this.prismaService.user.findUnique({
      where: { email },
      include: {
        state: true, // State 정보 포함
      },
    });

    if (!user) {
      throw new HttpException(
        '존재하지 않는 유저입니다.',
        HttpStatus.NOT_FOUND,
      );
    }

    return user;
  }

  async deleteUser(id: number) {
    return this.prismaService.user.delete({ where: { id } });
  }

  async createUser(signupDto: SignupDto) {
    const { email, nickname, password } = signupDto;

    const res = await this.prismaService.user.create({
      data: {
        email,
        nickname,
        password,
        state: {
          create: {
            name: '오프라인',
          },
        },
      },
      include: {
        state: true,
      },
    });
    console.log(res);

    const userInfo = {
      id: res.id,
      email: res.email,
      nickname: res.nickname,
      state: res.state.name,
    };
    return userInfo;
  }

  async changePassword(email: string, password: string) {
    await this.getUserByEmail(email);

    return this.prismaService.user.update({
      where: { email },
      data: { password },
    });
  }

  async updateUserNickname({
    id,
    nickname,
    email,
  }: {
    id?: string;
    nickname: string;
    email?: string;
  }) {
    if (id) {
      return this.prismaService.user.update({
        where: { id: +id },
        data: { nickname },
      });
    }

    return this.prismaService.user.update({
      where: { email },
      data: { nickname },
    });
  }

  async getState(id: number) {
    await this.getUserById(id);

    return this.prismaService.state.findUnique({ where: { userId: id } });
  }

  async changeState(id: number, stateDto: StateDto) {
    const { state } = stateDto;

    await this.getUserById(id);

    if (!['온라인', '오프라인', '자리비움'].includes(state)) {
      throw new HttpException('state가 틀렸습니다.', HttpStatus.NOT_FOUND);
    }

    return this.prismaService.state.update({
      where: { userId: id },
      data: { name: state },
    });
  }
}
