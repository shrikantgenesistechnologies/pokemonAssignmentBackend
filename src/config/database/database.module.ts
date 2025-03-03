import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { OrganizationModule } from '../../organizations/organizations.module';
import { UsersModule } from '../../users/users.module';
import { PokemonsModule } from '../../pokemons/pokemons.module';
import { Users } from '../../users/entity/user.entity';
import { Organizations } from '../../organizations/entity/organization.entity';
import { Pokemons } from '../../pokemons/entity/pokemon.entity';
import { SeederService } from './seeder.service';
import { Favorite } from '../../favorites/entity/favorite.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.name'),
        entities: [Users, Organizations, Pokemons, Favorite],
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    OrganizationModule,
    UsersModule,
    PokemonsModule,
  ],
  providers: [SeederService],
})
export class DatabaseModule {
  constructor(private dataSource: DataSource) {}
}
