import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organizations } from './entity/organizations.entity';
import { OrganizationsService } from './organizations.service';
import { OrganizationsController } from './organizations.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Organizations])],
  providers: [OrganizationsService, JwtService],
  controllers: [OrganizationsController],
  exports: [OrganizationsService],
})
export class OrganizationModule {}
