import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './entity/users.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Organizations } from '../organizations/entity/organizations.entity';
import * as bcrypt from 'bcrypt';
import { ValidateUser } from './dtos/validate-user.dto';
import { Request } from 'express';
import { User } from './interfaces/user.interface';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @InjectRepository(Organizations)
    private readonly organizationsRepository: Repository<Organizations>,
  ) {}

  async createOneUser(createUserDto: CreateUserDto): Promise<Users> {
    try {
      const existingUser = await this.usersRepository.findOne({
        where: { email: createUserDto.email },
      });

      if (existingUser) {
        throw new ConflictException('Email already exists in the organization');
      }

      const organization = await this.organizationsRepository.findOne({
        where: { id: createUserDto.organizationId },
      });
      if (!organization) {
        throw new NotFoundException('Organization not found');
      }

      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const user = this.usersRepository.create({
        ...createUserDto,
        password: hashedPassword,
        organization,
      });
      await this.usersRepository.save(user);

      const createdUser = await this.usersRepository.findOne({
        where: { id: user.id },
        relations: ['organization'],
      });
      return createdUser;
    } catch (error) {
      this.logger.error(
        JSON.stringify({
          context: 'Create User',
          resource: UsersService.name,
          message: error.message,
        }),
      );
      throw error;
    }
  }

  async findAllUsers(request: Request): Promise<Users[]> {
    try {
      const organizationId = (request?.user as User)?.organizationId;
      const users = await this.usersRepository.find({
        where: { organization: { id: organizationId } },
        relations: ['organization'],
      });
      if (!users) {
        throw new NotFoundException('User not found');
      }
      return users;
    } catch (error) {
      this.logger.error(
        JSON.stringify({
          context: 'List User',
          resource: UsersService.name,
          message: error.message,
        }),
      );
      throw error;
    }
  }

  async findOneUser(id: string, request: Request): Promise<Users> {
    try {
      const organizationId = (request?.user as User)?.organizationId;
      const user = await this.usersRepository.findOne({
        where: { id, organization: { id: organizationId } },
        relations: ['organization'],
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      this.logger.error(
        JSON.stringify({
          context: 'Get User',
          resource: UsersService.name,
          message: error.message,
        }),
      );
      throw error;
    }
  }

  async updateOneUser(
    id: string,
    updateUserDto: UpdateUserDto,
    request: Request,
  ): Promise<Users> {
    try {
      const organizationId = (request?.user as User)?.organizationId;
      const user = await this.usersRepository.findOne({
        where: { id, organization: { id: organizationId } },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      Object.assign(user, updateUserDto);
      await this.usersRepository.save(user);

      return user;
    } catch (error) {
      this.logger.error(
        JSON.stringify({
          context: 'Update User',
          resource: UsersService.name,
          message: error.message,
        }),
      );
      throw error;
    }
  }

  async updateUserLastLoginTimestamp(
    id: string,
    lastLoginTimestamp: number,
  ): Promise<Users> {
    try {
      const user = await this.usersRepository.findOne({
        where: { id },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }
      Object.assign(user, { lastLoginTimestamp });
      await this.usersRepository.save(user);

      return user;
    } catch (error) {
      this.logger.error(
        JSON.stringify({
          context: 'Update User',
          resource: UsersService.name,
          message: error.message,
        }),
      );
      throw error;
    }
  }

  async deleteOneUser(
    id: string,
    request: Request,
  ): Promise<{ message: string }> {
    try {
      const userId = (request?.user as User)?.id;
      const organizationId = (request?.user as User)?.organizationId;
      const user = await this.usersRepository.findOne({
        where: { id, organization: { id: organizationId } },
      });

      if (userId != id || !user) {
        throw new NotFoundException('User not found');
      }

      await this.usersRepository.remove(user);
      return { message: 'Record deleted successfully' };
    } catch (error) {
      this.logger.error(
        JSON.stringify({
          context: 'Delete User',
          resource: UsersService.name,
          message: error.message,
        }),
      );
      throw error;
    }
  }

  async validateUser(validateUser: ValidateUser): Promise<Users | null> {
    try {
      const { email, password } = validateUser;
      const user = await this.usersRepository.findOne({
        where: { email },
        relations: ['organization'],
        select: { id: true, password: true },
      });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new UnauthorizedException('Email or password is invalid');
      }
      return user;
    } catch (error) {
      this.logger.error(
        JSON.stringify({
          context: 'Validate User',
          resource: UsersService.name,
          message: error.message,
        }),
      );
      throw error;
    }
  }
}
