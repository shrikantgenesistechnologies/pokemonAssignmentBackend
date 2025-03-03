import {
  Injectable,
  UnauthorizedException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dtos/login.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { Request } from 'express';
import { RegisterDto } from './dtos/register.dto';
import { Users } from '../users/entity/user.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  private generateToken(
    payload: JwtPayload,
    secret: string,
    expiresIn: string,
  ) {
    try {
      return this.jwtService.sign(payload, { secret, expiresIn });
    } catch (error) {
      this.logger.error(
        JSON.stringify({
          context: 'Token Generation',
          resource: AuthService.name,
          message: error.message,
        }),
      );
      throw error;
    }
  }

  private createPayload(user: Users, lastLoginTimestamp?: number) {
    try {
      if (!user.organization?.id) {
        throw new BadRequestException('User organization ID is missing');
      }
      return {
        id: user.id,
        organizationId: user.organization.id,
        timestamp: user.lastLoginTimestamp
          ? user.lastLoginTimestamp
          : lastLoginTimestamp,
      };
    } catch (error) {
      this.logger.error(
        JSON.stringify({
          context: 'Payload Creation',
          resource: AuthService.name,
          message: error.message,
        }),
      );
      throw error;
    }
  }

  private async createTokens(user: Users, lastLoginTimestamp?: number) {
    try {
      const payload = this.createPayload(user, lastLoginTimestamp);
      const accessToken = this.generateToken(
        payload,
        this.configService.getOrThrow('jwt.secret_key'),
        this.configService.getOrThrow('jwt.expiration_duration'),
      );
      return { accessToken };
    } catch (error) {
      this.logger.error(
        JSON.stringify({
          context: 'Token Creation',
          resource: AuthService.name,
          message: error.message,
        }),
      );
      throw error;
    }
  }

  async login(loginDto: LoginDto) {
    try {
      const user = await this.usersService.validateUser({
        email: loginDto.email,
        password: loginDto.password,
      });
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }
      const lastLoginTimestamp = new Date().getTime();
      user.lastLoginTimestamp = lastLoginTimestamp;
      await this.usersService.updateOneUser(user.id, {
        lastLoginTimestamp,
      });

      const { accessToken } = await this.createTokens(user, lastLoginTimestamp);
      return { accessToken, id: user.id };
    } catch (error) {
      this.logger.error(
        JSON.stringify({
          context: 'User Login',
          resource: AuthService.name,
          message: error.message,
        }),
      );
      throw error;
    }
  }

  async logout(request: Request): Promise<string> {
    try {
      const user = request.user as Users;
      if (user) {
        await this.usersService.updateOneUser(user.id, {
          lastLoginTimestamp: new Date().getTime(),
        });
      }
      return 'Logout successful';
    } catch (error) {
      this.logger.error(
        JSON.stringify({
          context: 'User Logout',
          resource: AuthService.name,
          message: error.message,
        }),
      );
      throw error;
    }
  }

  async register(registerDto: RegisterDto) {
    try {
      const user = await this.usersService.createOneUser(registerDto);

      user.lastLoginTimestamp = new Date().getTime();
      await this.usersService.updateOneUser(user.id, {
        lastLoginTimestamp: user.lastLoginTimestamp,
      });

      const { accessToken } = await this.createTokens(user);
      return { accessToken, id: user.id };
    } catch (error) {
      this.logger.error(
        JSON.stringify({
          context: 'User Registration',
          resource: AuthService.name,
          message: error.message,
        }),
      );
      throw error;
    }
  }
}
