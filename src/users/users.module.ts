import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Users } from './entity/user.entity';
import { Organizations } from '../organizations/entity/organization.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Organizations])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
