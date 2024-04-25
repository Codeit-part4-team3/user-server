import { AuthService } from './auth.service';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Request,
} from '@nestjs/common';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const accessToken = request.headers['authorization']?.split(' ')[1];

    if (!accessToken) {
      throw new UnauthorizedException('헤더에 토큰이 없습니다.');
    }

    const user = await this.authService.tokenGetUser(accessToken);
    if (!user || !user.email) {
      throw new UnauthorizedException('유저가 없습니다.');
    }

    request['userId'] = user.id;
    return true;
  }
}
