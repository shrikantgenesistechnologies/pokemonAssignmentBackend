import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Matches,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Name of the User',
    example: 'Ash Ketchum',
    type: 'string',
  })
  @Matches(/^[a-zA-Z\s]+$/, {
    message: 'Name can only contain letters (a-z, A-Z) and spaces',
  })
  @IsString({ message: 'Name must be string' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @ApiProperty({
    description: 'Email address of the User',
    example: 'ash.ketchum@example.com',
    type: 'string',
  })
  @IsEmail({}, { message: 'Email address is invalid' })
  @IsString({ message: 'Email must be string' })
  @IsNotEmpty({ message: 'Email address is required' })
  email: string;

  @ApiProperty({
    description: 'Password for the User',
    example: 'Str0ngP@ss!',
    type: 'string',
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
  password: string;

  @ApiProperty({
    description: 'Organization ID to which the User belongs',
    example: '3f29ab3e-8f6a-4cbb-9f12-2d94ec5d5e3c',
    type: 'string',
  })
  @IsString({ message: 'Organization ID must be string' })
  @IsNotEmpty({ message: 'Organization ID is required' })
  organizationId: string;
}
