import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { UpdateOrganizationDto } from './dtos/update-organization.dto';
import { CreateOrganizationDto } from './dtos/create-organization.dto';
import {
  ApiXDeleteResponses,
  ApiXGetResponses,
  ApiXListResponses,
  ApiXUpdateResponses,
} from '../utils/swagger/swagger';
import { Organizations } from './entity/organizations.entity';
import { ApiParam } from '@nestjs/swagger';
import { ApiControllerTag } from '../swagger/tags';
import { JwtAuthGuard } from '../auth/guards/auth.guard';

@Controller(ApiControllerTag.Organizations)
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  @ApiXGetResponses({
    operationId: 'create_organization',
    summary: 'Create a new Organization',
    type: CreateOrganizationDto,
  })
  createOneOrganization(@Body() createOrganizationDto: CreateOrganizationDto) {
    return this.organizationsService.createOneOrganization(
      createOrganizationDto,
    );
  }

  @ApiXListResponses({
    operationId: 'list_organizations',
    summary: 'List all Organizations',
    type: [Organizations],
  })
  @HttpCode(HttpStatus.OK)
  @Get()
  findAllOrganizations() {
    return this.organizationsService.findAllOrganizations();
  }

  @UseGuards(JwtAuthGuard)
  @ApiParam({
    name: 'id',
    description: 'Organization ID',
    type: String,
  })
  @ApiXGetResponses({
    operationId: 'get_organization',
    summary: 'Get a single Organization by ID',
    type: Organizations,
  })
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  findOneOrganization(@Param('id') id: string) {
    return this.organizationsService.findOneOrganization(id);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  @ApiParam({
    name: 'id',
    description: 'Organization ID',
    type: String,
  })
  @ApiXUpdateResponses({
    operationId: 'update_organization',
    summary: 'Update an Organization by ID',
    type: UpdateOrganizationDto,
  })
  updateOneOrganization(
    @Param('id') id: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ) {
    return this.organizationsService.updateOneOrganization(
      id,
      updateOrganizationDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  @ApiParam({
    name: 'id',
    description: 'Organization ID',
    type: String,
  })
  @ApiXDeleteResponses({
    operationId: 'delete_organization',
    summary: 'Delete an Organization by ID',
    type: String,
  })
  deleteOneOrganization(@Param('id') id: string): Promise<{ message: string }> {
    return this.organizationsService.deleteOneOrganization(id);
  }
}
