import {
  Body,
  Controller,
  Get,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { StateDto } from './../dto/state.dto';
import { JwtAuthGuard } from './../auth/jwt-auth-guard';
import { failToken, unauthorized } from './../auth/api-response/tokenResponse';
import {
  MyInfoGet,
  MyStateGet,
  MyStatePut,
} from '../decorators/userDecorators';
import { AdminGuard } from 'src/auth/admin-guard';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('accessToken')
@unauthorized
@failToken
@ApiTags('user')
@Controller('/user/v1/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MyInfoGet('me')
  async getUser(@Request() request) {
    return await this.userService.getUserById(request.userId);
  }

  @MyStateGet('me/state')
  async getState(@Request() request) {
    return await this.userService.getState(request.userId);
  }

  @MyStatePut('me/state')
  async changeState(@Request() request, @Body() stateDto: StateDto) {
    return await this.userService.changeState(request.userId, stateDto);
  }

  @Get(':id')
  @UseGuards(AdminGuard)
  async getUserById(@Param('id') id: number) {
    return await this.userService.getUserById(id);
  }
}
