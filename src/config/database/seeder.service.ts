import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Organizations } from '../../organizations/entity/organization.entity';
import { Users } from '../../users/entity/user.entity';
import { Pokemons } from '../../pokemons/entity/pokemon.entity';
import { faker } from '@faker-js/faker';
import { HASHED_PASSWORD } from '../../utils/constants';
import axios from 'axios';
import { Pokemon } from '../../pokemons/interfaces/pokemon.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SeederService {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
  ) {}

  async fetchAllPokemon(url?: string) {
    try {
      const api = url || this.configService.getOrThrow<string>('pokemon.api');
      const response = await axios.get(api);
      return response.data;
    } catch (error) {
      this.logger.error(
        JSON.stringify({
          context: 'Fetching Pokémon Data',
          resource: SeederService.name,
          message: `Failed to fetch Pokémon data: ${error.message}`,
        }),
      );
      return { results: [], next: null };
    }
  }

  async seed() {
    this.logger.log(
      JSON.stringify({
        context: 'Seeding Process',
        resource: SeederService.name,
        message: 'Starting seeding process...',
      }),
    );

    const organizationRepo = this.dataSource.getRepository(Organizations);
    const userRepo = this.dataSource.getRepository(Users);
    const pokemonRepo = this.dataSource.getRepository(Pokemons);

    try {
      const existingOrganizations = await organizationRepo.count();
      if (existingOrganizations > 0) {
        this.logger.warn(
          JSON.stringify({
            context: 'Seeding Process',
            resource: SeederService.name,
            message: 'Organizations already exist, skipping seeding.',
          }),
        );
        return;
      }

      // Create 10 organizations
      const organizations = Array.from({ length: 10 }).map(() =>
        organizationRepo.create({ name: faker.company.name() }),
      );
      await organizationRepo.save(organizations);
      this.logger.log(
        JSON.stringify({
          context: 'Seeding Organizations',
          resource: SeederService.name,
          message: '10 Organizations seeded successfully!',
        }),
      );

      let nextUrl: string | null =
        this.configService.getOrThrow<string>('pokemon.api');

      while (nextUrl) {
        const { results: pokemonList, next } =
          await this.fetchAllPokemon(nextUrl);
        nextUrl = next;

        const pokemonEntities = pokemonList.map((poke: Pokemon) => {
          const randomOrganization =
            organizations[Math.floor(Math.random() * organizations.length)];
          return pokemonRepo.create({
            name: poke.name,
            originalId: poke.url.split('/')[6],
            organization: randomOrganization,
          });
        });

        await pokemonRepo.save(pokemonEntities);
        this.logger.log(
          JSON.stringify({
            context: 'Seeding Pokémon',
            resource: SeederService.name,
            message: `${pokemonEntities.length} Pokémon seeded.`,
          }),
        );
      }

      // Create 10 users for each organization
      for (const organization of organizations) {
        const users = Array.from({ length: 10 }).map(() => {
          const name = faker.person.fullName();
          const email = faker.internet.email();
          return userRepo.create({
            name,
            email,
            password: HASHED_PASSWORD,
            organization,
          });
        });

        await userRepo.save(users);
        this.logger.log(
          JSON.stringify({
            context: 'Seeding Users',
            resource: SeederService.name,
            message: `10 Users seeded for organization: ${organization.name}`,
          }),
        );
      }

      this.logger.verbose(
        JSON.stringify({
          context: 'Seeding Process',
          resource: SeederService.name,
          message: 'Seeding process completed successfully!',
        }),
      );
    } catch (error) {
      this.logger.error(
        JSON.stringify({
          context: 'Seeding Process',
          resource: SeederService.name,
          message: `Error during seeding process: ${error.message}`,
        }),
      );
    }
  }
}
