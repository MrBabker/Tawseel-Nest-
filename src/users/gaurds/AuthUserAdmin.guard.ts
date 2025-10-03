import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { CURRENT_USER_KEY, JWT_Payload, UserType } from 'src/utils';

@Injectable()
export class AuthUserAdminCookieGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();

    const cookies = request.cookies as { jwt?: string };
    const token = cookies.jwt;

    if (token) {
      try {
        const payload: JWT_Payload = await this.jwtService.verifyAsync(token, {
          secret: this.config.get<string>('JWT_SECRET'),
        });

        if (
          payload.isemployee === false ||
          payload.employeetype === UserType.normal.toString()
        ) {
          throw new UnauthorizedException(
            'you are not Unauthorized to do this',
          );
          return false;
        } else {
          request[CURRENT_USER_KEY] = payload;
          console.log(payload.isemployee);
          return true;
        }
      } catch (error: any) {
        throw new UnauthorizedException({
          message: error + ' : you need to login again',
        });
        return false;
      }
    } else {
      throw new UnauthorizedException('you are not Unauthorized to do this');
      return false;
    }
  }
}
