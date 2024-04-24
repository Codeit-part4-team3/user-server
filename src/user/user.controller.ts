import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('user')
@Controller('api/user/v1/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @ApiOperation({
    summary: '유저 정보',
  })
  async getUser(@Param('id') id: string) {
    const data = await this.userService.getUser({ id });
    if (!data) {
      throw new HttpException(
        '존재하지 않는 유저입니다.',
        HttpStatus.NOT_FOUND,
      );
    }
    return data;
  }
}
