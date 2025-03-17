import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { ERole } from '../../../../shared/enum';

export class CreateRoleDto {
  @ApiProperty({ enum: ERole })
  @IsNotEmpty()
  @IsEnum(ERole)
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  description?: string;
}
