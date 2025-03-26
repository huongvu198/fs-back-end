import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { EApiTags } from '../../shared/enum';
import { ProductSegmentService } from './segment/segment.service';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { CreateSegmentDto } from './segment/dto/segment.request.dto';
import { CreateCategoryDto } from './categories/dto/category.request.dto';
import { CreateSubCategoryDto } from './sub-categories/dto/sub-category.request.dto';
import { ProductCategoryService } from './categories/categories.service';
import { ProductSubcategoryService } from './sub-categories/sub-categories.service';

@ApiTags(EApiTags.PRODUCT)
@Controller('product')
export class ProductsController {
  constructor(
    private readonly productSegmentService: ProductSegmentService,
    private readonly productCategoryService: ProductCategoryService,
    private readonly productSubcategoryService: ProductSubcategoryService,
  ) {}

  @Get('get-segments')
  @ApiOperation({
    description: 'to get all segments',
    operationId: 'getSegments',
  })
  @HttpCode(HttpStatus.OK)
  async getSegments() {
    return await this.productSegmentService.findAllSegmentWithPopulate();
  }

  @Post('create-segment')
  @ApiOperation({
    description: 'to create segment',
    operationId: 'createSegment',
  })
  @HttpCode(HttpStatus.CREATED)
  async createSegment(@Body() dto: CreateSegmentDto) {
    return await this.productSegmentService.create(dto);
  }
  @Post('create-category')
  @ApiOperation({
    description: 'to create category',
    operationId: 'createCategory',
  })
  @HttpCode(HttpStatus.CREATED)
  async createCategory(@Body() dto: CreateCategoryDto) {
    return await this.productCategoryService.create(dto);
  }
  @Post('create-subcategory')
  @ApiOperation({
    description: 'to create subcategory',
    operationId: 'createSubCategory',
  })
  @HttpCode(HttpStatus.CREATED)
  async createSubCategory(@Body() dto: CreateSubCategoryDto) {
    return await this.productSubcategoryService.create(dto);
  }
}
