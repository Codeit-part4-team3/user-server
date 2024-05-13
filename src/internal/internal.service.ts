import { Inject, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from '../prisma.service';
import { Logger } from 'winston';

@Injectable()
export class InternalService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async getUserByIds(userIds: number[]) {
    const users = await Promise.all(
      userIds.map(async (userId) => {
        const user = await this.prismaService.user.findUnique({
          where: {
            id: userId,
          },
          include: {
            state: true,
          },
        });

        return {
          id: user.id,
          email: user.email,
          nickname: user.nickname,
          state: user.state?.name || null,
          imageUrl: user.imageUrl || '',
        };
      }),
    );
    return users;
  }

  async verifyEmail(email: string): Promise<User> {
    return this.prismaService.user.findUnique({
      where: { email: email },
    });
  }
}
