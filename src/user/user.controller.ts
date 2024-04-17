import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @ApiOperation({
    summary: '유저 정보',
  })
  async getUser(@Param('id') id: string) {
    return await this.userService.getUser({ id });
  }
}
