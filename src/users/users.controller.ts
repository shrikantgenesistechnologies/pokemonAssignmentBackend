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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Users } from './entity/user.entity';
import { ApiTags, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import {
  ApiXDeleteResponses,
  ApiXGetResponses,
  ApiXListResponses,
  ApiXUpdateResponses,
} from '../utils/swagger/swagger';
import { ApiControllerTag } from '../swagger/tags';
import { JwtAuthGuard } from '../auth/guards/auth.guard';

@ApiBearerAuth()
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
  async findAllUsers(): Promise<Users[]> {
    return this.usersService.findAllUsers();
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
  async findOneUser(@Param('id') id: string): Promise<Users> {
    return this.usersService.findOneUser(id);
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
  ): Promise<Users> {
    return this.usersService.updateOneUser(id, updateUserDto);
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
    type: 'string',
  })
  async deleteOneUser(@Param('id') id: string): Promise<void> {
    await this.usersService.deleteOneUser(id);
  }
}
