import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Users } from '../../users/entity/users.entity';
import { Pokemons } from '../../pokemons/entity/pokemons.entity';
import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

@Entity()
export class Organizations {
  @ApiProperty({
    description: 'Unique identifier for the Organization',
    type: 'string',
    example: '2d202425-23a8-4d34-b8f0-0128320e1546',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiPropertyOptional({
    description: 'Name of the Organization',
    type: 'string',
    example: 'Roob Inc',
  })
  @Matches(/^[a-zA-Z\s]+$/, {
    message: 'Organization Name can only contain letters (a-z, A-Z) and spaces',
  })
  @Transform(({ value }) => value.trim().toLowerCase())
  @Column({
    unique: true,
  })
  @IsString()
  @IsNotEmpty({ message: 'Organization name is required' })
  @IsOptional()
  name: string;

  @OneToMany(() => Users, (user) => user.organization)
  @IsOptional()
  users: Users[];

  @OneToMany(() => Pokemons, (pokemon) => pokemon.organization)
  @IsOptional()
  pokemons: Pokemons[];
}
