import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthModel {
  @ApiProperty({
    description: 'The access token for the authenticated user.',
    type: 'string',
    example: 'string',
    format: 'jwt',
  })
  @IsString()
  @IsNotEmpty()
  accessToken: string;
}
