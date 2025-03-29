import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
  IsArray,
} from 'class-validator';

import { Transform, Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';

class CreateSizeDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  size: string;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  @Transform(({ value }) => value === 'true' || value === true)
  isActive: boolean;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}

export class CreateVariantDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  color: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  image: string;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  @Transform(({ value }) => value === 'true' || value === true)
  isActive: boolean;

  @ApiProperty({ type: [CreateSizeDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSizeDto)
  sizes: CreateSizeDto[];
}

export class CreateProductDto {
  //Information about segment
  @ApiProperty()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty()
  @IsNotEmpty()
  subCategoryId: string;

  @ApiProperty()
  @IsNotEmpty()
  segmentId: string;

  //Information about product
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  @Transform(({ value }) => value === 'true' || value === true)
  isActive: boolean;

  @ApiPropertyOptional()
  @IsNumber()
  discount?: number;

  @ApiProperty({ type: [CreateVariantDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVariantDto)
  variants: CreateVariantDto[];
}

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  subCategoryId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  segmentId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  price?: number;

  @ApiPropertyOptional()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  isArchived?: boolean;
}

export class UpdateSizeDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  size: string;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  @Transform(({ value }) => value === 'true' || value === true)
  isActive: boolean;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}

class UpdateVariantDTO {
  @ApiProperty({ example: '#000000' })
  @IsNotEmpty()
  @IsString()
  color: string;

  @ApiProperty({ example: 'https://example.com/image.jpg' })
  @IsNotEmpty()
  @IsString()
  image: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsNotEmpty()
  @Transform(({ value }) => value === 'true' || value === true)
  isActive: boolean;

  @ApiProperty({ type: [UpdateSizeDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateSizeDto)
  sizes: UpdateSizeDto[];
}

export class UpdateSaleDto {
  @ApiPropertyOptional()
  @IsNumber()
  discount?: number;

  @ApiProperty({ type: [UpdateVariantDTO] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateVariantDTO)
  variants: UpdateVariantDTO[];
}
