import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  getUserTokenData,
  getUserTokenNotData,
} from './api-response/getUserTokenResponse';
import { SignUpSchema } from './schema/signup.schema';
import {
  signupNotData,
  signupSuccessData,
} from './api-response/signUpResponse';
import { SignupDto } from '../dto/signup.dto';
import { ConfirmSignupDto } from './../dto/confirmSignup.dto';
import { LoginDto } from './../dto/login.dto';
import { EmailDto } from './../dto/email.dto';

@ApiTags('auth')
@Controller('api/user/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 토큰으로 유저 확인
  @Get('user')
  @ApiOperation({
    summary: '토큰으로 로그인',
  })
  @getUserTokenNotData
  @getUserTokenData
  async getUser(@Request() request) {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    if (type !== 'Bearer' || !token) {
      throw new HttpException('토큰이 없습니다.', HttpStatus.BAD_REQUEST);
    }
    return await this.authService.tokenGetUser(token);
  }

  //회원가입
  @Post('signup')
  @ApiOperation({
    summary: '회원가입',
  })
  @ApiBody({ type: SignUpSchema })
  @signupSuccessData
  @signupNotData
  async signUp(@Body() signupDto: SignupDto) {
    return this.authService.signUp(signupDto);
  }

  // 이메일 인증
  @Post('signup/confirm')
  @ApiOperation({
    summary: '회원가입 이메일 인증',
  })
  async confirmSignup(@Body() confirmSignupDto: ConfirmSignupDto) {
    return await this.authService.confirmSignUp(confirmSignupDto);
  }

  // 인증번호 다시보내기
  @Post('signup/resend')
  @ApiOperation({
    summary: '이메일 인증 다시 보내기',
  })
  async resendConfirmationCode(@Body() emailDto: EmailDto) {
    return this.authService.resendConfirmationCode(emailDto);
  }

  //로그인
  @Post('login')
  @ApiOperation({
    summary: '로그인',
  })
  async Login(@Body() loginDto: LoginDto) {
    return await this.authService.Login(loginDto);
  }

  //토큰 갱신
  @Get('token')
  @ApiOperation({
    summary: '리프레쉬 토큰으로 토큰 갱신',
  })
  async getToken(@Request() request) {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    if (type !== 'Bearer' || !token) {
      throw new HttpException('토큰이 없습니다.', HttpStatus.NOT_FOUND);
    }

    return await this.authService.getToken(token);
  }
}
