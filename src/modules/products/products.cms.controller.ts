import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { EApiCmsTags } from '../../shared/enum';
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
  Query,
} from '@nestjs/common';
import { CreateSegmentDto } from './dto/segment.request.dto';
import { CreateCategoryDto } from './dto/category.request.dto';
import { CreateSubCategoryDto } from './dto/sub-category.request.dto';
import { ProductCategoryService } from './categories/categories.service';
import { ProductSubcategoryService } from './sub-categories/sub-categories.service';
import { ProductService } from './products.service';
import {
  CreateProductDto,
  GetProductDto,
  UpdateProductDto,
  UpdateSaleDto,
} from './dto/product.request.dto';
import {
  ApiPagination,
  IPagination,
} from '../../shared/pagination/pagination.interface';
import { Pagination } from '../../shared/pagination/pagination.decorator';

@ApiTags(EApiCmsTags.PRODUCT)
@Controller('cms/product')
export class ProductsControllerCms {
  constructor(
    private readonly productSegmentService: ProductSegmentService,
    private readonly productCategoryService: ProductCategoryService,
    private readonly productSubcategoryService: ProductSubcategoryService,
    private readonly productService: ProductService,
  ) {}

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
  //Segment End

  //Product Start
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

  @Patch('update-product/:id')
  @ApiOperation({
    description: 'to update product',
    operationId: 'updateProduct',
  })
  @HttpCode(HttpStatus.OK)
  async updateBasicProduct(
    @Param('id') productId: string,
    @Body() dto: UpdateProductDto,
  ) {
    return await this.productService.update(productId, dto);
  }

  @Get('all')
  @ApiOperation({
    description: 'product list',
    operationId: 'findAllProduct',
  })
  @ApiPagination()
  @HttpCode(HttpStatus.OK)
  async findAllProduct(
    @Query() query: GetProductDto,
    @Pagination() pagination: IPagination,
  ) {
    return await this.productService.findAllProductCms(query, pagination);
  }

  @Get('/:id')
  @ApiOperation({
    description: 'product detail',
    operationId: 'findProductByIdCms',
  })
  @HttpCode(HttpStatus.OK)
  async findProductByIdCms(@Param('id') productId: string) {
    return await this.productService.findProductByIdCms(productId);
  }
}
