import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class ListPokemonQueryDto {
  @ApiPropertyOptional({
    description: 'Page number for pagination',
    type: 'number',
    example: 1,
  })
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @IsOptional()
  skip?: number;

  @ApiPropertyOptional({
    description: 'Page size per page',
    type: 'number',
    example: 5,
  })
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @IsOptional()
  take: number;
}
