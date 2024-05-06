import { Get, HttpCode, applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  LoginNotData,
  loginForbidden,
  loginOk,
} from '../auth/api-response/loginResponse';
import { signupConflictException } from '../auth/api-response/signUpResponse';

export function KakaoLoginGet(path: string) {
  return applyDecorators(
    Get(path),
    HttpCode(200),
    ApiOperation({
      summary: '카카오 로그인',
    }),
    loginOk,
    loginForbidden,
    LoginNotData,
  );
}

export function KakaoSignupGet(path: string) {
  return applyDecorators(
    Get(path),
    HttpCode(201),
    ApiOperation({
      summary: '카카오 회원가입',
    }),
    ApiResponse({ status: 201, description: 'Created' }),
    signupConflictException,
  );
}

export function GoogleLoginGet(path: string) {
  return applyDecorators(
    Get(path),
    HttpCode(200),
    ApiOperation({
      summary: '구글 로그인',
    }),
    loginOk,
    loginForbidden,
    LoginNotData,
  );
}

export function GoogleSignupGet(path: string) {
  return applyDecorators(
    Get(path),
    HttpCode(201),
    ApiOperation({
      summary: '구글 회원가입',
    }),
    ApiResponse({ status: 201, description: 'Created' }),
    signupConflictException,
  );
}
