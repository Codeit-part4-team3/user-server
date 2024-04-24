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
import { EmailDto } from './../dto/email.dto';
import { ForgotPasswordDto } from './../dto/forgotPassword.dto';
import { ChangePasswordDto } from './../dto/changePassword.dto';

@Controller('api/user/v1/')
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
  @ApiResponse({ status: 204 })
  @forgotNotData
  async forgotPassword(@Body() emailDto: EmailDto) {
    return this.authService.forgotPassword(emailDto);
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
  @ApiResponse({ status: 204 })
  @forgotConfirmNotData
  async confirmPasswordReset(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return await this.authService.confirmPasswordReset(forgotPasswordDto);
  }

  // 비밀번호 변경
  @ApiTags('auth')
  @Post('user/password')
  @ApiOperation({
    summary: '비밀번호 변경',
  })
  @ApiResponse({ status: 204 })
  @changePasswordNotData
  async changePassword(
    @Request() request,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    if (type !== 'Bearer' || !token) {
      throw new HttpException('토큰이 없습니다.', HttpStatus.BAD_REQUEST);
    }

    return await this.authService.changePassword(token, changePasswordDto);
  }
}
