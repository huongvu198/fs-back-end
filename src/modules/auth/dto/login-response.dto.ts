import { ApiProperty } from '@nestjs/swagger';

class UserResponse {
  email: string;
  role: string;
}
class CustomerResponse {
  email: string;
}

export class LoginResponseDto {
  @ApiProperty()
  token: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  tokenExpires: number;

  @ApiProperty({
    type: () => UserResponse,
  })
  user: UserResponse;
}
export class LoginCustomerResponseDto {
  @ApiProperty()
  token: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  tokenExpires: number;

  @ApiProperty({
    type: () => CustomerResponse,
  })
  customer: CustomerResponse;
}
