import { ApiProperty } from '@nestjs/swagger';
import { RoleResponse } from '../../../roles/dto/response/role.response';

export class CreateUserResponse {
  @ApiProperty({ example: '60d9c5f6f1b2c8001c8d1a2e' })
  _id: string;

  @ApiProperty({ example: 'test@example.com' })
  email: string;

  @ApiProperty({ example: 'Mai' })
  name: string;

  @ApiProperty({ example: '+84901234567' })
  phoneNumber: string;

  @ApiProperty({ type: RoleResponse })
  role: RoleResponse;
}
