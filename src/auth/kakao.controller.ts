import { Controller, Query } from '@nestjs/common';
import { KakaoService } from './kakao.service';
import { ApiTags } from '@nestjs/swagger';
import { KakaoLoginGet, KakaoSignupGet } from 'src/decorators/oauthDecoreators';

@ApiTags('oauth')
@Controller('/user/v1/auth/')
export class KakaoController {
  constructor(private readonly kakaoService: KakaoService) {}

  @KakaoSignupGet('kakao/signup')
  async getKakaoSignUp(@Query('code') code: string) {
    return await this.kakaoService.kakaoSignUp(code);
  }

  @KakaoLoginGet('kakao/login')
  async getKakaoLogin(@Query('code') code: string) {
    return await this.kakaoService.kakaoLogin(code);
  }
}
