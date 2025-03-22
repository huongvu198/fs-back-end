import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
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

export class VerifyAccountDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  customerId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  codeExpires: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(6, 6, { message: 'Verification code must be exactly 6 characters' })
  @Transform(({ value }) => String(value))
  code: string;
}

export class ResendCodeVerifyDto {
  @ApiProperty({ example: 'test@example.com' })
  @IsNotEmpty()
  @IsEmail()
  @Transform(({ value }) => lowerCaseTransformer(value))
  email: string;
}
