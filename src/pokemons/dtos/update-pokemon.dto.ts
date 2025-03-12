import { ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { Pokemons } from '../entity/pokemons.entity';
import { IsString, IsNotEmpty } from 'class-validator';

export class UpdatePokemonDto extends PickType(Pokemons, [
  'name',
  'originalId',
]) {
  @ApiPropertyOptional({
    description: 'Organization Id associated with Pokemon',
    type: 'string',
    example: '0017c9ae-1c79-4a54-93b4-2b9e8ab0d080',
  })
  @IsString({ message: 'Organization ID must be string' })
  @IsNotEmpty({ message: 'Organization ID is required' })
  organizationId: string;
}
