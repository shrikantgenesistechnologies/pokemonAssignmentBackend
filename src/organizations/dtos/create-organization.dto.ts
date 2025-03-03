import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class CreateOrganizationDto {
  @ApiPropertyOptional({
    description: 'Name of the Organization',
    type: 'string',
    example: 'Roob Inc',
  })
  @Matches(/^[a-zA-Z\s]+$/, {
    message: 'Organization Name can only contain letters (a-z, A-Z) and spaces',
  })
  @IsString({ message: 'Organization name must be string' })
  @IsNotEmpty({ message: 'Organization name is required' })
  name: string;
}
