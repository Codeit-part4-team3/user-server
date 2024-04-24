import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { StateDto } from './../dto/state.dto';

@ApiTags('user')
@Controller('api/user/v1/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @ApiOperation({
    summary: '유저 정보',
  })
  async getUser(@Param('id') id: string) {
    return await this.userService.getUserById(+id);
  }

  @Get(':id/state')
  async getState(@Param('id') id) {
    return await this.userService.getState(+id);
  }

  @Put(':id/state')
  async changeState(@Param('id') id, @Body() stateDto: StateDto) {
    return await this.userService.changeState(+id, stateDto);
  }
}
