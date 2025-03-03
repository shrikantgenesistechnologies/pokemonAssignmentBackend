import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pokemons } from './entity/pokemon.entity';
import { CreatePokemonDto } from './dtos/create-pokemon.dto';
import { UpdatePokemonDto } from './dtos/update-pokemon.dto';
import { Organizations } from '../organizations/entity/organization.entity';
import { Request } from 'express';
import { ListPokemonQueryDto } from './dtos/list-pokemon.dto';
import { User } from '../users/interfaces/user.interface';
import { FavoriteStatus } from '../enums/favorites-status.enum';
import { Favorite } from '../favorites/entity/favorite.entity';
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
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,
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
    req: Request,
    query: ListPokemonQueryDto,
  ): Promise<any> {
    try {
      const { skip = 0, take = 5 } = query;
      const organizationId = (req?.user as User)?.organizationId;
      const userId = (req?.user as User)?.id;

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

  async findOnePokemon(id: string): Promise<GetPokemonResponseDto> {
    try {
      const pokemon = await this.pokemonRepository.findOne({
        where: { id },
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
  ): Promise<GetPokemonResponseDto> {
    try {
      const pokemon = await this.findOnePokemon(id);
      const organization = await this.organizationRepository.findOne({
        where: { id: updatePokemonDto.organizationId },
      });

      if (!organization) {
        throw new BadRequestException('Organization Id is invalid');
      }

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

  async deletePokemon(id: string): Promise<void> {
    try {
      const pokemon = await this.pokemonRepository.findOne({ where: { id } });
      await this.pokemonRepository.remove(pokemon);
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

  async updateFavoriteStatus({ userId, pokemonId, favoriteStatus }) {
    try {
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
