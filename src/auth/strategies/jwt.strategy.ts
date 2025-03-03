import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getOrThrow<string>('jwt.secret_key'),
    });
  }

  async validate(payload: JwtPayload) {
    if (!payload || !payload.id) {
      throw new UnauthorizedException('Invalid token payload');
    }

    const dbUser = await this.usersService.findOneUser(payload.id);
    if (!dbUser || !dbUser.lastLoginTimestamp) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (payload.timestamp < dbUser.lastLoginTimestamp) {
      throw new UnauthorizedException('Token is invalid');
    }
    return payload;
  }
}
