import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './entity/user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Organizations } from '../organizations/entity/organization.entity';
import * as bcrypt from 'bcrypt';
import { ValidateUser } from './dtos/validate-user.dto';

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
        throw new ConflictException('Email already exists');
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

  async findAllUsers(): Promise<Users[]> {
    try {
      const users = await this.usersRepository.find({
        relations: ['organization'],
      });
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

  async findOneUser(id: string): Promise<Users> {
    try {
      const user = await this.usersRepository.findOne({
        where: { id },
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
  ): Promise<Users> {
    try {
      const user = await this.usersRepository.findOne({ where: { id } });

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

  async deleteOneUser(id: string): Promise<void> {
    try {
      const user = await this.usersRepository.findOne({ where: { id } });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      await this.usersRepository.remove(user);
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
