import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pokemons } from './entity/pokemon.entity';
import { Organizations } from '../organizations/entity/organization.entity';
import { PokemonController } from './pokemons.controller';
import { PokemonsService } from './pokemons.service';
import { Favorite } from '../favorites/entity/favorite.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pokemons, Organizations, Favorite])],
  controllers: [PokemonController],
  providers: [PokemonsService],
  exports: [PokemonsService],
})
export class PokemonsModule {}
