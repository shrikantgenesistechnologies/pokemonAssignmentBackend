import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MetadataModel } from './metadata.model';

export class GlobalResponseApiModel {
  statusCode?: number;

  @ApiProperty({
    description: 'A message providing details about the response.',
    required: true,
    type: String,
  })
  message?: string | unknown;

  @ApiProperty({
    description: 'ISO time of the response.',
    required: true,
  })
  timestamp?: string;

  @ApiProperty({
    description: 'The requested API endpoint.',
    required: true,
  })
  path?: string;
}

export class GlobalExceptionResponseApiModel extends GlobalResponseApiModel {
  @ApiProperty({
    description: 'Error message or object',
    required: true,
    example: ['string'],
  })
  message: string[] | unknown;
}

export class GlobalSuccessResponseApiModel extends GlobalResponseApiModel {
  @ApiProperty({
    description: 'Response data',
  })
  data: Record<string, unknown> | Record<string, unknown>[];

  @ApiPropertyOptional({
    description: 'Metadata of response',
  })
  metadata?: MetadataModel;
}
