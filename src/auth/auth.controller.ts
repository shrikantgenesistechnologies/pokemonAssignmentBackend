import {
  Controller,
  Post,
  Body,
  Req,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { Request, Response } from 'express';
import { RegisterDto } from './dtos/register.dto';
import { ApiControllerTag } from '../swagger/tags';
import { ApiXGetResponses } from '../utils/swagger/swagger';

@Controller(ApiControllerTag.Auth)
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('login')
  @ApiXGetResponses({
    operationId: 'login_user',
    summary: 'Login User',
    type: String,
  })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return await this.authService.login(loginDto, response);
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  @ApiXGetResponses({
    operationId: 'logout_user',
    summary: 'Logout user',
    type: String,
  })
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    return await this.authService.logout(request, response);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  @ApiXGetResponses({
    operationId: 'register',
    summary: 'register User',
    type: String,
  })
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ) {
    return await this.authService.register(registerDto, response, request);
  }
}
