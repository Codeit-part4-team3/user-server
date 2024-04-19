import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Request,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { ForgotSchema } from './schema/forgot.schema';
import { ForgotConfirmSchema } from './schema/forgotConfirm.schema';
import {
  changePasswordNotData,
  forgotConfirmNotData,
  forgotNotData,
} from './api-response/passwordResponse';

@Controller('')
export class PasswordController {
  constructor(private readonly authService: AuthService) {}

  // 비밀번호 잃어버렸을때 변경 코드요청
  @ApiTags('forgot')
  @Post('forgot')
  @ApiOperation({
    summary: '비밀번호 찾기',
  })
  @ApiBody({
    type: ForgotSchema,
  })
  @ApiResponse({ status: 201 })
  @forgotNotData
  async forgotPassword(@Body() data) {
    try {
      return this.authService.forgotPassword(data.email);
    } catch (e) {
      return e;
    }
  }

  // 비밀번호 리셋 및 새로운 비밀번호 생성
  @ApiTags('forgot')
  @Post('forgot/confirm')
  @ApiOperation({
    summary: '비밀번호 재설정',
  })
  @ApiBody({
    type: ForgotConfirmSchema,
  })
  @ApiResponse({ status: 201 })
  @forgotConfirmNotData
  async confirmPasswordReset(@Body() data) {
    try {
      await this.authService.confirmPasswordReset(
        data.email,
        data.newPassword,
        data.code,
      );
    } catch (e) {
      throw new HttpException('잘못 된 코드입니다.', HttpStatus.BAD_REQUEST);
    }
  }

  // 비밀번호 변경
  @ApiTags('auth')
  @Post('user/password')
  @ApiOperation({
    summary: '비밀번호 변경',
  })
  @ApiResponse({ status: 201 })
  @changePasswordNotData
  async changePassword(@Request() request, @Body() data) {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    if (type !== 'Bearer' || !token) {
      throw new HttpException('토큰이 없습니다.', HttpStatus.BAD_REQUEST);
    }
    try {
      await this.authService.changePassword(
        token,
        data.currentPassword,
        data.newPassword,
      );
    } catch (e) {
      throw new HttpException(
        '토큰 또는 비밀번호가 유효하지 않습니다.',
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
