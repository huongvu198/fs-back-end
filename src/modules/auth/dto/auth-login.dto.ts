import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AuthLoginDto {
  @ApiProperty({ example: 'huongvt@newwave.com.vn' })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({ example: '12022001' })
  @IsNotEmpty()
  password: string;
}
