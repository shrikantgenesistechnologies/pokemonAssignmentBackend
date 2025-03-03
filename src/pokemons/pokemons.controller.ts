import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  Query,
  Req,
} from '@nestjs/common';
import { PokemonsService } from './pokemons.service';
import { CreatePokemonDto } from './dtos/create-pokemon.dto';
import { UpdatePokemonDto } from './dtos/update-pokemon.dto';
import { ApiControllerTag } from '../swagger/tags';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import {
  ApiXDeleteResponses,
  ApiXGetResponses,
  ApiXListResponses,
  ApiXUpdateResponses,
} from '../utils/swagger/swagger';
import { Pokemons } from './entity/pokemon.entity';
import { ListPokemonQueryDto } from './dtos/list-pokemon.dto';
import { Request } from 'express';
import { FavoriteStatus } from '../enums/favorites-status.enum';
import { User } from '../users/interfaces/user.interface';
import { GetPokemonResponseDto } from './dtos/get-pokemon.dto';
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller(ApiControllerTag.Pokemons)
export class PokemonController {
  constructor(private readonly pokemonService: PokemonsService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  @ApiXGetResponses({
    operationId: 'create_pokemon',
    summary: 'Create a new Pokémon',
    type: CreatePokemonDto,
  })
  create(@Body() createPokemonDto: CreatePokemonDto) {
    return this.pokemonService.createPokemon(createPokemonDto);
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  @ApiXListResponses({
    operationId: 'list_pokemons',
    summary: 'List all Pokémon',
    type: [Pokemons],
  })
  findAll(@Req() req: Request, @Query() query: ListPokemonQueryDto) {
    return this.pokemonService.findAllPokemons(req, query);
  }

  @HttpCode(HttpStatus.OK)
  @Post(':id/favoriteStatus')
  @ApiParam({
    name: 'id',
    description: 'Pokémon ID',
    type: String,
  })
  @ApiXUpdateResponses({
    operationId: 'update_favorite_status',
    summary: 'Update favorite status of pokemon',
    type: 'string',
  })
  async toggleFavoriteStatus(
    @Param('id') pokemonId: string,
    @Query('favoriteStatus') favoriteStatus: FavoriteStatus,
    @Req() req: Request,
  ) {
    const userId = (req.user as User)?.id;
    return this.pokemonService.updateFavoriteStatus({
      userId,
      pokemonId,
      favoriteStatus,
    });
  }
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  @ApiParam({
    name: 'id',
    description: 'Pokémon ID',
    type: String,
  })
  @ApiXGetResponses({
    operationId: 'get_pokemon',
    summary: 'Get a single Pokémon by ID',
    type: GetPokemonResponseDto,
  })
  findOne(@Param('id') id: string) {
    return this.pokemonService.findOnePokemon(id);
  }

  @HttpCode(HttpStatus.OK)
  @Put(':id')
  @ApiParam({
    name: 'id',
    description: 'Pokémon ID',
    type: String,
  })
  @ApiXUpdateResponses({
    operationId: 'update_pokemon',
    summary: 'Update a Pokémon by ID',
    type: UpdatePokemonDto,
  })
  update(@Param('id') id: string, @Body() updatePokemonDto: UpdatePokemonDto) {
    return this.pokemonService.updatePokemon(id, updatePokemonDto);
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  @ApiParam({
    name: 'id',
    description: 'Pokémon ID',
    type: String,
  })
  @ApiXDeleteResponses({
    operationId: 'delete_pokemon',
    summary: 'Delete a Pokémon by ID',
    type: 'string',
  })
  remove(@Param('id') id: string) {
    return this.pokemonService.deletePokemon(id);
  }
}
