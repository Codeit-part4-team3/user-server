import { Controller, Get, HttpCode, Query } from '@nestjs/common';
import { KakaoService } from './kakao.service';

@Controller('/user/v1/auth/')
export class KakaoController {
  constructor(private readonly kakaoService: KakaoService) {}

  @HttpCode(201)
  @Get('kakao/signup')
  async getKakaoSignUp(@Query('code') code: string) {
    return await this.kakaoService.kakaoSignUp(code);
  }

  @HttpCode(200)
  @Get('kakao/login')
  async getKakaoLogin(@Query('code') code: string) {
    return await this.kakaoService.kakaoLogin(code);
  }
}
