import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async getUser({
    email,
    id,
  }: {
    email?: string;
    id?: string;
  }): Promise<User | null> {
    if (id) {
      return this.prismaService.user.findUnique({ where: { id: +id } });
    }
    return this.prismaService.user.findUnique({ where: { email } });
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
