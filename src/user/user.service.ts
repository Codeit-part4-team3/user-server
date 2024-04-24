import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async getUserById(id: number) {
    if (!id) {
      throw new HttpException('id는 필수 입니다.', HttpStatus.NOT_FOUND);
    }

    const user = await this.prismaService.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new HttpException(
        '존재하지 않는 유저입니다.',
        HttpStatus.NOT_FOUND,
      );
    }
    return user;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    if (!email) {
      throw new HttpException('email은 필수 입니다.', HttpStatus.NOT_FOUND);
    }
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new HttpException(
        '존재하지 않는 유저입니다.',
        HttpStatus.NOT_FOUND,
      );
    }
    return user;
  }

  async deleteUser(id: string) {
    return this.prismaService.user.delete({ where: { id: +id } });
  }

  async createUser(data) {
    return this.prismaService.user.create({ data });
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
}
