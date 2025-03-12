import { PickType } from '@nestjs/swagger';
import { Organizations } from '../entity/organizations.entity';

export class UpdateOrganizationDto extends PickType(Organizations, ['name']) {}
