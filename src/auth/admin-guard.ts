// admin.guard.ts

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const accessToken = request.headers['authorization']?.split(' ')[1];

    if (!accessToken) {
      throw new UnauthorizedException('access token이 없습니다.');
    }

    const role = await this.authService.tokenGetRole(accessToken);
    if (role !== 'admin') {
      throw new UnauthorizedException(`관리자 권한이 없습니다: ${role}`);
    }

    return true;
  }
}
