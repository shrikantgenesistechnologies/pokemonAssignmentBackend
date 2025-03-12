import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { UsersService } from '../../users/users.service';
import { cookieExtractor } from '../utils/cookieExtractor';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: cookieExtractor,
      secretOrKey: configService.getOrThrow<string>('jwt.secret_key'),
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: JwtPayload) {
    if (!payload || !payload.id) {
      throw new UnauthorizedException('Token is invalid');
    }

    const dbUser = await this.usersService.findOneUser(payload.id, request);
    if (!dbUser || !dbUser.lastLoginTimestamp) {
      throw new UnauthorizedException('Token has expired');
    }

    if (payload.timestamp < dbUser.lastLoginTimestamp) {
      throw new UnauthorizedException('Token is invalid');
    }
    return payload;
  }
}
