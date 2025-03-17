import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { lowerCaseTransformer } from '../../../../shared/transformers/lower-case.transformer';
import { Transform } from 'class-transformer';

export class UpdateCustomerDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  _id: string;

  @ApiPropertyOptional({ example: 'Mai', type: String })
  @IsOptional()
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: '0827261123' })
  @IsOptional()
  @IsString()
  phoneNumber: string;
}

export class CreateCustomerDto {
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
}

export class AddAddressDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  street: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  ward: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  district: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  country: string;

  @ApiProperty()
  @IsBoolean()
  isDefault: boolean;
}
