import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Organizations } from '../../organizations/entity/organization.entity';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  Matches,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { Favorite } from '../../favorites/entity/favorite.entity';

@Entity()
export class Users {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'Unique ID of the User' })
  id: string;

  @ApiProperty({
    description: 'Name of the User',
    type: 'string',
    example: 'Ash Ketchum',
  })
  @Transform(({ value }) => value.trim().toLowerCase())
  @Matches(/^[a-zA-Z\s]+$/, {
    message: 'Name can only contain letters (a-z, A-Z) and spaces',
  })
  @Column()
  @IsString()
  @IsNotEmpty({ message: 'User name is required' })
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'Email address of the User',
    example: 'ash@example.com',
  })
  @Transform(({ value }) => value.trim())
  @Column({ unique: true })
  @IsEmail({}, { message: 'Email address is invalid' })
  @IsNotEmpty({ message: 'Email is required' })
  @IsOptional()
  email?: string;

  @Column()
  @ApiPropertyOptional({
    description: 'Password for the User',
    example: 'P@ssw0rd!',
    minLength: 6,
    maxLength: 30,
  })
  @MaxLength(30, {
    message: 'Password must be shorter than or equal to 30 characters',
  })
  @IsString({ message: 'Password must be a string' })
  @IsStrongPassword(
    {
      minLength: 6,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      minUppercase: 1,
    },
    {
      message:
        'Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    },
  )
  @IsNotEmpty({ message: 'Password is required' })
  @IsOptional()
  password?: string;

  @Column({ type: 'bigint', nullable: true })
  @IsOptional()
  lastLoginTimestamp: number;

  @ManyToOne(() => Organizations, (org) => org.users, { onDelete: 'CASCADE' })
  @IsNotEmpty({ message: 'Organization is required' })
  @IsOptional()
  organization: Organizations;

  @OneToMany(() => Favorite, (favorite) => favorite.user)
  favorites: Favorite[];
}
