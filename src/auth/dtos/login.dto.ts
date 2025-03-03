import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsStrongPassword,
  IsEmail,
} from 'class-validator';

export class LoginDto {
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
}
