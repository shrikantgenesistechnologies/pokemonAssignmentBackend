import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { Request } from 'express';
import { JwtAuthGuard } from './guards/auth.guard';
import { RegisterDto } from './dtos/register.dto';
import { ApiControllerTag } from '../swagger/tags';
import { ApiXGetResponses } from '../utils/swagger/swagger';
import { AuthModel } from './model/auth.model';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller(ApiControllerTag.Auth)
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('login')
  @ApiXGetResponses({
    operationId: 'login_user',
    summary: 'Login User',
    type: AuthModel,
  })
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  @ApiXGetResponses({
    operationId: 'logout_user',
    summary: 'Logout user',
    type: 'string',
  })
  @UseGuards(JwtAuthGuard)
  async logout(@Req() request: Request) {
    return await this.authService.logout(request);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  @ApiXGetResponses({
    operationId: 'register',
    summary: 'register User',
    type: AuthModel,
  })
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }
}
