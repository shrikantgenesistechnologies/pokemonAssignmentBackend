import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  HttpCode,
  HttpStatus,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Users } from './entity/users.entity';
import { ApiTags, ApiParam } from '@nestjs/swagger';
import {
  ApiXDeleteResponses,
  ApiXGetResponses,
  ApiXListResponses,
  ApiXUpdateResponses,
} from '../utils/swagger/swagger';
import { ApiControllerTag } from '../swagger/tags';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { Request } from 'express';

@UseGuards(JwtAuthGuard)
@ApiTags(ApiControllerTag.Users)
@Controller(ApiControllerTag.Users)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  @ApiXGetResponses({
    operationId: 'create_user',
    summary: 'Create a new User',
    type: Users,
  })
  async createOneUser(@Body() createUserDto: CreateUserDto): Promise<Users> {
    return this.usersService.createOneUser(createUserDto);
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  @ApiXListResponses({
    operationId: 'list_users',
    summary: 'List all Users',
    type: [Users],
  })
  async findAllUsers(@Req() request: Request): Promise<Users[]> {
    return this.usersService.findAllUsers(request);
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  @ApiParam({
    name: 'id',
    description: 'User ID',
    type: String,
  })
  @ApiXGetResponses({
    operationId: 'get_user',
    summary: 'Get a single User by ID',
    type: Users,
  })
  async findOneUser(
    @Param('id') id: string,
    @Req() request: Request,
  ): Promise<Users> {
    return this.usersService.findOneUser(id, request);
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  @ApiParam({
    name: 'id',
    description: 'User ID',
    type: String,
  })
  @ApiXUpdateResponses({
    operationId: 'update_user',
    summary: 'Update an existing User',
    type: Users,
  })
  async updateOneUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() request: Request,
  ): Promise<Users> {
    return this.usersService.updateOneUser(id, updateUserDto, request);
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  @ApiParam({
    name: 'id',
    description: 'User ID',
    type: String,
  })
  @ApiXDeleteResponses({
    operationId: 'delete_user',
    summary: 'Delete a User by ID',
    type: String,
  })
  async deleteOneUser(
    @Param('id') id: string,
    @Req() request: Request,
  ): Promise<void> {
    await this.usersService.deleteOneUser(id, request);
  }
}
