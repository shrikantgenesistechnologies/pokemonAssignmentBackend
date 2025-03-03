import { PickType } from '@nestjs/swagger';
import { Organizations } from '../entity/organization.entity';

export class UpdateOrganizationDto extends PickType(Organizations, ['name']) {}
