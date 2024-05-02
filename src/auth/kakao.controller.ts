import { Controller, Get, Query } from '@nestjs/common';
import { KakaoService } from './kakao.service';

@Controller('/user/v1/auth/')
export class KakaoController {
  constructor(private readonly kakaoService: KakaoService) {}

  @Get('kakao/signup')
  async getKakaoSignUp(@Query('code') code: string) {
    await this.kakaoService.kakaoSignUp(code);
  }

  @Get('kakao/login')
  async getKakaoLogin(@Query('code') code: string) {
    return await this.kakaoService.kakaoLogin(code);
  }
}
