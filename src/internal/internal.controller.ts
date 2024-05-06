import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { InternalService } from './internal.service';
import { UserByIdsDto, VerifyEmailDto } from 'src/dto/internal.dto';
import { User } from '@prisma/client';

@Controller('internal/v1')
export class InternalController {
  constructor(private readonly internalService: InternalService) {}

  @Post('userNames')
  async getUserNames(@Body() userDto: UserByIdsDto): Promise<User[]> {
    return this.internalService.getUserByIds(userDto.ids);
  }

  @Post('verifyEmail')
  @HttpCode(200)
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto): Promise<User> {
    return this.internalService.verifyEmail(verifyEmailDto.email);
  }
}
