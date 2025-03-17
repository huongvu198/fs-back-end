import { ApiProperty } from '@nestjs/swagger';

export class RoleResponse {
  @ApiProperty({ example: '60d9c5f6f1b2c8001c8d1a2e' })
  _id: string;

  @ApiProperty({ example: 'Admin' })
  name: string;
}
