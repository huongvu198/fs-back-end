import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSegmentService } from './segment/segment.service';
import { ProductSegmentRepository } from './segment/segment.repository';
import { ProductSegment, ProductSegmentSchema } from './segment/segment.schema';
import { ProductsController } from './products.controller';
import {
  ProductCategory,
  ProductCategorySchema,
} from './categories/categories.schema';
import {
  ProductSubcategory,
  ProductSubcategorySchema,
} from './sub-categories/sub-categories.schema';
import { ProductCategoryRepository } from './categories/categories.repository';
import { ProductSubCategoryRepository } from './sub-categories/sub-categories.repository';
import { ProductSubcategoryService } from './sub-categories/sub-categories.service';
import { ProductCategoryService } from './categories/categories.service';
import { ProducSchema, Product } from './products.schema';
import { ProductRepository } from './products.repository';
import { ProductService } from './products.service';
import { PaginationHeaderHelper } from '../../shared/pagination/pagination.helper';

@Module({
  controllers: [ProductsController],
  exports: [
    ProductSegmentService,
    ProductCategoryService,
    ProductSubcategoryService,
    ProductService,
  ],
  imports: [
    MongooseModule.forFeature([
      { name: ProductSegment.name, schema: ProductSegmentSchema },
      { name: ProductCategory.name, schema: ProductCategorySchema },
      { name: ProductSubcategory.name, schema: ProductSubcategorySchema },
      { name: Product.name, schema: ProducSchema },
    ]),
  ],
  providers: [
    ProductSegmentService,
    ProductCategoryService,
    ProductSubcategoryService,
    ProductService,
    ProductSegmentRepository,
    ProductCategoryRepository,
    ProductSubCategoryRepository,
    ProductRepository,
    PaginationHeaderHelper,
  ],
})
export class ProductsModule {}
