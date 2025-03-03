import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Organizations } from '../../organizations/entity/organization.entity';
import { IsNotEmpty, IsString, IsOptional, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { Favorite } from '../../favorites/entity/favorite.entity';

@Entity()
export class Pokemons {
  @ApiProperty({
    description: 'Unique identifier for the Pokemon',
    type: 'string',
    example: '2d202425-23a8-4d34-b8f0-0128320e1546',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiPropertyOptional({
    description: 'Name of the Pokemon',
    type: 'string',
    example: 'dolliv',
  })
  @Matches(/^[a-zA-Z\s]+$/, {
    message: 'Pokemon Name can only contain letters (a-z, A-Z) and spaces',
  })
  @Transform(({ value }) => value.trim().toLowerCase())
  @Column({ unique: true })
  @IsString({ message: 'Pokemon name must be string' })
  @IsNotEmpty({ message: 'Pokemon name is required' })
  @IsOptional()
  name: string;

  @ApiPropertyOptional({
    description: 'Image URL for pokemon',
    type: 'string',
    example:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/320.png',
  })
  @Column()
  @IsString({ message: 'OriginalId must be string' })
  @IsOptional()
  originalId: string;

  @ManyToOne(() => Organizations, (org) => org.pokemons, {
    onDelete: 'CASCADE',
  })
  organization: Organizations;

  @OneToMany(() => Favorite, (favorite) => favorite.pokemon)
  favorites: Favorite[];
}
