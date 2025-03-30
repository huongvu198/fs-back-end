import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { EApiTags } from '../../shared/enum';
import { ProductSegmentService } from './segment/segment.service';
import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { ProductService } from './products.service';

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
    private readonly productService: ProductService,
  ) {}

  //Segment Start
  @Get('get-segments')
  @ApiOperation({
    description: 'to get all segments',
    operationId: 'getSegments',
  })
  @HttpCode(HttpStatus.OK)
  async getSegments() {
    return await this.productSegmentService.findAllSegmentWithPopulate();
  }
  //Segment End

  //Product Start
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

  @Get('/:id')
  @ApiOperation({
    description: 'product detail',
    operationId: 'findProductById',
  })
  @HttpCode(HttpStatus.OK)
  async findProductById(@Param('id') productId: string) {
    return await this.productService.findProductById(productId);
  }
}
