import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organizations } from './entity/organization.entity';
import { OrganizationsService } from './organizations.service';
import { OrganizationsController } from './organizations.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Organizations])],
  providers: [OrganizationsService],
  controllers: [OrganizationsController],
  exports: [OrganizationsService],
})
export class OrganizationModule {}
