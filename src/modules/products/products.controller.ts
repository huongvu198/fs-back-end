import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { EApiTags } from '../../shared/enum';
import { ProductSegmentService } from './segment/segment.service';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateSegmentDto } from './dto/segment.request.dto';
import { CreateCategoryDto } from './dto/category.request.dto';
import { CreateSubCategoryDto } from './dto/sub-category.request.dto';
import { ProductCategoryService } from './categories/categories.service';
import { ProductSubcategoryService } from './sub-categories/sub-categories.service';
import { ProductService } from './products.service';
import {
  CreateProductDto,
  UpdateProductDto,
  UpdateSaleDto,
} from './dto/product.request.dto';
import {
  ApiPagination,
  IPagination,
} from '../../shared/pagination/pagination.interface';
import { Pagination } from '../../shared/pagination/pagination.decorator';

@ApiTags(EApiTags.PRODUCT)
@Controller('product')
export class ProductsController {
  constructor(
    private readonly productSegmentService: ProductSegmentService,
    private readonly productCategoryService: ProductCategoryService,
    private readonly productSubcategoryService: ProductSubcategoryService,
    private readonly productService: ProductService,
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

  @Post('create-product')
  @ApiOperation({
    description: 'to create product',
    operationId: 'createProduct',
  })
  @HttpCode(HttpStatus.CREATED)
  async createProduct(@Body() dto: CreateProductDto) {
    return await this.productService.create(dto);
  }

  @Patch('archive/:id')
  @ApiOperation({
    description: 'to archive product',
    operationId: 'archiveProduct',
  })
  @HttpCode(HttpStatus.OK)
  async archiveProduct(@Param('id') productId: string) {
    return await this.productService.archive(productId);
  }

  @Get('new-arrivals')
  @ApiOperation({
    description: 'to get new arrivals',
    operationId: 'getNewArrivals',
  })
  @ApiPagination()
  @HttpCode(HttpStatus.OK)
  async getNewArrivals(@Pagination() pagination: IPagination) {
    return await this.productService.findNewArrivals(pagination);
  }

  @Get('best-sellers')
  @ApiOperation({
    description: 'to get best sellers',
    operationId: 'getBestSellers',
  })
  @ApiPagination()
  @HttpCode(HttpStatus.OK)
  async getBestSellers(@Pagination() pagination: IPagination) {
    return await this.productService.findBestSellers(pagination);
  }

  @Patch('update-basic/:id')
  @ApiOperation({
    description: 'to update product',
    operationId: 'updateBasicProduct',
  })
  @HttpCode(HttpStatus.OK)
  async updateBasicProduct(
    @Param('id') productId: string,
    @Body() dto: UpdateProductDto,
  ) {
    return await this.productService.updateBasicInfo(productId, dto);
  }

  @Patch('update-sale/:id')
  @ApiOperation({
    description: 'to update product',
    operationId: 'updateSaleProduct',
  })
  @HttpCode(HttpStatus.OK)
  async updateSaleProduct(
    @Param('id') productId: string,
    @Body() dto: UpdateSaleDto,
  ) {
    return await this.productService.updateSaleInfo(productId, dto);
  }
}
