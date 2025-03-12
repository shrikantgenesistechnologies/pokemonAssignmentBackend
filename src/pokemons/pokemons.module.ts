import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pokemons } from './entity/pokemons.entity';
import { Organizations } from '../organizations/entity/organizations.entity';
import { PokemonController } from './pokemons.controller';
import { PokemonsService } from './pokemons.service';
import { Favorites } from '../favorites/entity/favorites.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Pokemons, Organizations, Favorites])],
  controllers: [PokemonController],
  providers: [PokemonsService, JwtService],
  exports: [PokemonsService],
})
export class PokemonsModule {}
