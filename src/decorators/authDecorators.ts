import {
  Get,
  HttpCode,
  Post,
  Put,
  UseGuards,
  applyDecorators,
} from '@nestjs/common';
import {
  signupConflictException,
  signupNotData,
} from '../auth/api-response/signUpResponse';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { signupConfirmNotData } from './../auth/api-response/signupConfirmResponse';
import {
  loginBadRequest,
  loginForbidden,
  loginOk,
} from '../auth/api-response/loginResponse';
import {
  failToken,
  refreshTokenSuccess,
} from '../auth/api-response/tokenResponse';
import {
  changePasswordNotData,
  forgotNotData,
} from '../auth/api-response/passwordResponse';
import { JwtAuthGuard } from './../auth/jwt-auth-guard';
import { unauthorized } from './../auth/api-response/tokenResponse';

export function SignUpPost(path: string) {
  return applyDecorators(
    Post(path),
    HttpCode(201),
    ApiOperation({
      summary: '회원가입',
    }),
    ApiResponse({ status: 201, description: 'Created' }),
    signupNotData,
    signupConflictException,
  );
}

export function SignUpConfirmPost(path: string) {
  return applyDecorators(
    Post(path),
    HttpCode(201),
    ApiOperation({
      summary: '회원가입 이메일 인증',
    }),
    ApiResponse({ status: 201, description: 'Created' }),
    signupConfirmNotData,
  );
}

export function SignUpResentCodePost(path: string) {
  return applyDecorators(
    Post(path),
    HttpCode(201),
    ApiOperation({
      summary: '이메일 인증 다시 보내기',
    }),
    ApiResponse({ status: 201, description: 'Created' }),
  );
}

export function LoginPost(path: string) {
  return applyDecorators(
    Post(path),
    HttpCode(200),
    ApiOperation({
      summary: '로그인',
    }),
    loginOk,
    loginBadRequest,
    loginForbidden,
  );
}

export function AccessTokenGet(path: string) {
  return applyDecorators(
    Get(path),
    HttpCode(200),
    ApiOperation({
      summary: '리프레쉬 토큰으로 토큰 갱신',
    }),
    refreshTokenSuccess,
    failToken,
  );
}

export function ForgotPost(path: string) {
  return applyDecorators(
    Post(path),
    ApiOperation({
      summary: '비밀번호 찾기',
    }),
    HttpCode(201),
    ApiResponse({ status: 201, description: 'Created' }),
    forgotNotData,
  );
}

export function ForgotConfirmPost(path: string) {
  return applyDecorators(
    Post(path),
    ApiOperation({
      summary: '비밀번호 재설정',
    }),
    HttpCode(201),
    ApiResponse({ status: 201, description: 'Created' }),
    forgotNotData,
  );
}

export function ChangePasswordPut(path: string) {
  return applyDecorators(
    Put(path),
    ApiOperation({
      summary: '비밀번호 변경',
    }),
    HttpCode(201),
    ApiResponse({ status: 201, description: 'Created' }),
    UseGuards(JwtAuthGuard),
    ApiBearerAuth('accessToken'),
    changePasswordNotData,
    unauthorized,
  );
}
