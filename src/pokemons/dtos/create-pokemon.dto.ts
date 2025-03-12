import { ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { Pokemons } from '../entity/pokemons.entity';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreatePokemonDto extends PickType(Pokemons, ['originalId']) {
  @ApiPropertyOptional({
    description: 'Name of the Pokemon',
    type: 'string',
    example: 'dolliv',
  })
  @IsString({ message: 'Name must be string' })
  @IsNotEmpty({ message: 'Organization name is required' })
  name: string;

  @ApiPropertyOptional({
    description: 'Organization Id associated with Pokemon',
    type: 'string',
    example: '0017c9ae-1c79-4a54-93b4-2b9e8ab0d080',
  })
  @IsString({ message: 'Organization ID must be string' })
  @IsNotEmpty({ message: 'Organization ID is required' })
  organizationId: string;
}
