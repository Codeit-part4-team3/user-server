import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { FriendService } from './friend.service';
import { SendFriendDto } from './../dto/sendFriend.dto';
import { UpdateFriendRequest } from '../dto/updateFriendRequest.dto';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { EmailDto } from '../dto/email.dto';
import { JwtAuthGuard } from './../auth/jwt-auth-guard';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('accessToken')
@ApiTags('friend')
@Controller('/user/v1/friend')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @Post('send')
  @ApiBody({ type: SendFriendDto })
  async sendFriend(@Request() request, @Body() emailDto: EmailDto) {
    return await this.friendService.sendFriend({
      email: emailDto.email,
      userId: request.userId,
    });
  }

  @Get('receive')
  async getReceiveFriendRequest(@Request() request) {
    return await this.friendService.getReceiveFriendRequest(request.userId);
  }

  @Put('accepted')
  @ApiBody({ type: UpdateFriendRequest })
  async updateFriendRequest(
    @Request() request,
    @Body() updateFriendRequest: UpdateFriendRequest,
  ) {
    await this.friendService.updateFriendRequest(
      request.userId,
      updateFriendRequest,
    );
  }

  @Get('list')
  async getFriendList(@Request() request) {
    return await this.friendService.getFriendList(request.userId);
  }
}
