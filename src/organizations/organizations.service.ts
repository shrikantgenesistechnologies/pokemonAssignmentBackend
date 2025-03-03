import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organizations } from './entity/organization.entity';
import { CreateOrganizationDto } from './dtos/create-organization.dto';
import { UpdateOrganizationDto } from './dtos/update-organization.dto';

@Injectable()
export class OrganizationsService {
  private readonly logger = new Logger(OrganizationsService.name);

  constructor(
    @InjectRepository(Organizations)
    private readonly organizationsRepository: Repository<Organizations>,
  ) {}

  async createOneOrganization(
    createOrganizationDto: CreateOrganizationDto,
  ): Promise<Organizations> {
    try {
      const existingOrg = await this.organizationsRepository.findOne({
        where: { name: createOrganizationDto.name },
      });

      if (existingOrg) {
        throw new ConflictException('Organization name already exists');
      }

      const organization = this.organizationsRepository.create(
        createOrganizationDto,
      );
      await this.organizationsRepository.save(organization);
      return organization;
    } catch (error) {
      this.logger.error(
        JSON.stringify({
          context: 'Create Organization',
          resource: OrganizationsService.name,
          message: error.message,
        }),
      );
      throw error;
    }
  }

  async findAllOrganizations(): Promise<Organizations[]> {
    try {
      const organizations = await this.organizationsRepository.find();
      return organizations;
    } catch (error) {
      this.logger.error(
        JSON.stringify({
          context: 'List Organization',
          resource: OrganizationsService.name,
          message: error.message,
        }),
      );
      throw error;
    }
  }

  async findOneOrganization(id: string): Promise<Organizations> {
    try {
      const organization = await this.organizationsRepository.findOne({
        where: { id },
      });

      if (!organization) {
        throw new NotFoundException('Organization not found');
      }

      return organization;
    } catch (error) {
      this.logger.error(
        JSON.stringify({
          context: 'Get Organization',
          resource: OrganizationsService.name,
          message: error.message,
        }),
      );
      throw error;
    }
  }

  async updateOneOrganization(
    id: string,
    updateOrganizationDto: UpdateOrganizationDto,
  ): Promise<Organizations> {
    try {
      const organization = await this.organizationsRepository.findOne({
        where: { id },
      });

      if (!organization) {
        throw new NotFoundException('Organization not found');
      }

      Object.assign(organization, updateOrganizationDto);
      await this.organizationsRepository.save(organization);
      return organization;
    } catch (error) {
      this.logger.error(
        JSON.stringify({
          context: 'update Organization',
          resource: OrganizationsService.name,
          message: error.message,
        }),
      );
      throw error;
    }
  }

  async deleteOneOrganization(id: string): Promise<void> {
    try {
      const organization = await this.organizationsRepository.findOne({
        where: { id },
      });

      if (!organization) {
        throw new NotFoundException('Organization not found');
      }

      await this.organizationsRepository.remove(organization);
    } catch (error) {
      this.logger.error(
        JSON.stringify({
          context: 'Delete Organization',
          resource: OrganizationsService.name,
          message: error.message,
        }),
      );
      throw error;
    }
  }
}
