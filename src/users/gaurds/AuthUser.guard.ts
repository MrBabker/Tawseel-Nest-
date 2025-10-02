import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { CURRENT_USER_KEY, JWT_Payload } from 'src/utils';

@Injectable()
export class AuthUserCookieGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();

    const cookies = request.cookies as { jwt?: string };
    const token = cookies.jwt;

    if (token) {
      const payload: JWT_Payload = await this.jwtService.verifyAsync(token, {
        secret: this.config.get<string>('JWT_SECRET'),
      });

      request[CURRENT_USER_KEY] = payload;
    } else {
      //throw new UnauthorizedException('no token');
      return false;
    }

    return true;
  }
}
