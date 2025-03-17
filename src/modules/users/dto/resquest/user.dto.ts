import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { plainToInstance, Transform, Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { lowerCaseTransformer } from '../../../../shared/transformers/lower-case.transformer';
import { UserProfile } from '../../interface/user.interface';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'test1@example.com', type: String })
  @IsOptional()
  @Transform(({ value }) => lowerCaseTransformer(value))
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: 'Mai', type: String })
  @IsOptional()
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: '123' })
  @IsOptional()
  @IsString()
  role: string;
}

export class UpdateStatusUserDto {
  @ApiProperty({ example: '123', type: String })
  @IsString()
  id: string;

  @ApiProperty({ type: String })
  @IsString()
  status: string;
}

export class SortUserDto {
  @ApiProperty()
  @Type(() => String)
  @IsString()
  orderBy: keyof UserProfile;

  @ApiProperty()
  @IsNumber()
  order: 1 | -1;
}

export class GetUsersDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    example: [
      { order: -1, orderBy: 'role' },
      { order: 1, orderBy: 'name' },
    ],
    type: String,
  })
  @IsOptional()
  @Transform(({ value }) => {
    return value ? plainToInstance(SortUserDto, JSON.parse(value)) : undefined;
  })
  @ValidateNested({ each: true })
  @Type(() => SortUserDto)
  sort?: SortUserDto[] | null;
}

export class CreateUserDto {
  @ApiProperty({ example: 'test@example.com' })
  @IsNotEmpty()
  @IsEmail()
  @Transform(({ value }) => lowerCaseTransformer(value))
  email: string;

  @ApiProperty({ example: '0827261123' })
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({ example: 'Mai' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: '60d9c5f6f1b2c8001c8d1a2e' })
  @IsNotEmpty()
  @IsString()
  role: string;
}
