import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl } from 'class-validator';

export class GetPokemonResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the Pokemon',
    type: 'string',
    example: '2d202425-23a8-4d34-b8f0-0128320e1546',
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: 'Name of the Pokemon',
    type: 'string',
    example: 'dolliv',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Image url of pokemon',
    type: 'string',
    example: 'http://',
  })
  @IsUrl({}, { message: 'Invalid image URL' })
  imageUrl: string;
}
