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
import { ApiParam } from '@nestjs/swagger';
import {
  ApiXDeleteResponses,
  ApiXGetResponses,
  ApiXListResponses,
  ApiXUpdateResponses,
} from '../utils/swagger/swagger';
import { Pokemons } from './entity/pokemons.entity';
import { ListPokemonQueryDto } from './dtos/list-pokemon.dto';
import { Request } from 'express';
import { FavoriteStatus } from '../enums/favorites-status.enum';
import { GetPokemonResponseDto } from './dtos/get-pokemon.dto';

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
  findAll(@Req() request: Request, @Query() query: ListPokemonQueryDto) {
    return this.pokemonService.findAllPokemons(request, query);
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
    @Req() request: Request,
  ) {
    return this.pokemonService.updateFavoriteStatus({
      request,
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
  findOne(@Param('id') id: string, @Req() request: Request) {
    return this.pokemonService.findOnePokemon(id, request);
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
  update(
    @Param('id') id: string,
    @Body() updatePokemonDto: UpdatePokemonDto,
    @Req() request: Request,
  ) {
    return this.pokemonService.updatePokemon(id, updatePokemonDto, request);
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
    type: String,
  })
  remove(
    @Param('id') id: string,
    @Req() request: Request,
  ): Promise<{ message: string }> {
    return this.pokemonService.deletePokemon(id, request);
  }
}
