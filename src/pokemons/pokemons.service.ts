import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pokemons } from './entity/pokemons.entity';
import { CreatePokemonDto } from './dtos/create-pokemon.dto';
import { UpdatePokemonDto } from './dtos/update-pokemon.dto';
import { Organizations } from '../organizations/entity/organizations.entity';
import { Request } from 'express';
import { ListPokemonQueryDto } from './dtos/list-pokemon.dto';
import { User } from '../users/interfaces/user.interface';
import { FavoriteStatus } from '../enums/favorites-status.enum';
import { Favorites } from '../favorites/entity/favorites.entity';
import { ConfigService } from '@nestjs/config';
import { GetPokemonResponseDto } from './dtos/get-pokemon.dto';
@Injectable()
export class PokemonsService {
  private readonly logger = new Logger(PokemonsService.name);

  constructor(
    @InjectRepository(Pokemons)
    private readonly pokemonRepository: Repository<Pokemons>,
    @InjectRepository(Organizations)
    private readonly organizationRepository: Repository<Organizations>,
    @InjectRepository(Favorites)
    private readonly favoriteRepository: Repository<Favorites>,
    private readonly configService: ConfigService,
  ) {}

  async createPokemon(createPokemonDto: CreatePokemonDto): Promise<Pokemons> {
    try {
      const organization = await this.organizationRepository.findOne({
        where: { id: createPokemonDto.organizationId },
      });
      if (!organization) {
        throw new NotFoundException('Organization not found');
      }

      const pokemon = this.pokemonRepository.create(createPokemonDto);
      await this.pokemonRepository.save(pokemon);
      return pokemon;
    } catch (error) {
      this.logger.error(
        JSON.stringify({
          context: 'Create Pokemon',
          resource: PokemonsService.name,
          message: error.message,
        }),
      );
      throw error;
    }
  }
  async findAllPokemons(
    request: Request,
    query: ListPokemonQueryDto,
  ): Promise<any> {
    try {
      const { skip = 0, take = 5 } = query;
      const organizationId = (request?.user as User)?.organizationId;
      const userId = (request?.user as User)?.id;

      const [pokemons, total] = await this.pokemonRepository.findAndCount({
        where: { organization: { id: organizationId } },
        relations: ['favorites', 'favorites.user'],
        skip,
        take,
      });

      const pokemonWithFavorites = pokemons.map((pokemon) => {
        const totalLike = pokemon.favorites.filter(
          (fav) => fav.favoriteStatus === FavoriteStatus.LIKE,
        ).length;

        const totalDislike = pokemon.favorites.filter(
          (fav) => fav.favoriteStatus === FavoriteStatus.DISLIKE,
        ).length;

        const userFavorite = pokemon.favorites.find(
          (fav) => fav.user.id === userId,
        );

        return {
          id: pokemon.id,
          name: pokemon.name,
          imageUrl: this.getPokemonImageUrl(pokemon.originalId),
          totalLike,
          totalDislike,
          userFavoriteStatus:
            userFavorite?.favoriteStatus || FavoriteStatus.UNLIKED,
        };
      });

      const totalPages = Math.ceil(total / take);

      return {
        data: pokemonWithFavorites,
        metadata: {
          page: Math.floor(skip / take) + 1,
          totalPages,
          pageSize: take,
          totalRecords: total,
        },
      };
    } catch (error) {
      this.logger.error(
        JSON.stringify({
          context: 'List Pokemon',
          resource: PokemonsService.name,
          message: error.message,
        }),
      );
      throw error;
    }
  }

  async findOnePokemon(
    id: string,
    request: Request,
  ): Promise<GetPokemonResponseDto> {
    try {
      const organizationId = (request?.user as User)?.organizationId;

      const pokemon = await this.pokemonRepository.findOne({
        where: { id, organization: { id: organizationId } },
      });
      if (!pokemon) {
        throw new NotFoundException('Pokemon not found');
      }
      return this.serializedData(pokemon);
    } catch (error) {
      this.logger.error(
        JSON.stringify({
          context: 'Get Pokemon',
          resource: PokemonsService.name,
          message: error.message,
        }),
      );
      throw error;
    }
  }

  async updatePokemon(
    id: string,
    updatePokemonDto: UpdatePokemonDto,
    request: Request,
  ): Promise<GetPokemonResponseDto> {
    try {
      const pokemon = await this.findOnePokemon(id, request);
      Object.assign(pokemon, updatePokemonDto);
      await this.pokemonRepository.save(pokemon);
      return pokemon;
    } catch (error) {
      this.logger.error(
        JSON.stringify({
          context: 'Update Pokemon',
          resource: PokemonsService.name,
          message: error.message,
        }),
      );
      throw error;
    }
  }

  async deletePokemon(
    id: string,
    request: Request,
  ): Promise<{ message: string }> {
    try {
      const organizationId = (request?.user as User)?.organizationId;
      const pokemon = await this.pokemonRepository.findOne({
        where: { id, organization: { id: organizationId } },
      });

      if (!pokemon) {
        throw new NotFoundException('Pokemon not found');
      }
      await this.pokemonRepository.remove(pokemon);
      return { message: 'Record deleted successfully' };
    } catch (error) {
      this.logger.error(
        JSON.stringify({
          context: 'Delete Pokemon',
          resource: PokemonsService.name,
          message: error.message,
        }),
      );
      throw error;
    }
  }

  async updateFavoriteStatus({ request, pokemonId, favoriteStatus }) {
    try {
      const user = request?.user as User;
      const userId = user.id;
      await this.findOnePokemon(pokemonId, request);

      const existingFavorite = await this.favoriteRepository.findOne({
        where: { user: { id: userId }, pokemon: { id: pokemonId } },
      });

      if (existingFavorite) {
        if (favoriteStatus === existingFavorite.favoriteStatus) {
          await this.favoriteRepository.remove(existingFavorite);
          return { message: 'Favorite removed successfully' };
        }

        existingFavorite.favoriteStatus = favoriteStatus;
        await this.favoriteRepository.save(existingFavorite);
        return { message: 'Favorite updated successfully' };
      }

      const newFavorite = this.favoriteRepository.create({
        user: { id: userId },
        pokemon: { id: pokemonId },
        favoriteStatus,
      });
      await this.favoriteRepository.save(newFavorite);
      return { message: 'Favorite created successfully' };
    } catch (error) {
      this.logger.error(
        JSON.stringify({
          context: 'Update favorite status of Pokemon',
          resource: PokemonsService.name,
          message: error.message,
        }),
      );
      throw error;
    }
  }
  private serializedData(pokemon: Pokemons) {
    return {
      id: pokemon.id,
      name: pokemon.name,
      imageUrl: this.getPokemonImageUrl(pokemon.originalId),
    };
  }
  private getPokemonImageUrl(id: string) {
    const baseImageUrl = this.configService.get<string>(
      'pokemon.image_base_url',
    );
    return `${baseImageUrl}/${id}.png`;
  }
}
