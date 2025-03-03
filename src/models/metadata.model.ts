import { ApiProperty } from '@nestjs/swagger';

export class MetadataModel {
  @ApiProperty({
    description: 'The page number.',
    required: true,
  })
  page: number;

  @ApiProperty({
    description: 'The page size.',
    required: true,
  })
  pageSize: number;
  @ApiProperty({
    description: 'Total count of records.',
    required: true,
  })
  totalCount: number;
}
