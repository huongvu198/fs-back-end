import { BadRequestException, Injectable } from '@nestjs/common';
import { ProductRepository } from './products.repository';
import {
  CreateProductDto,
  UpdateProductDto,
  UpdateSaleDto,
} from './dto/product.request.dto';
import { ProductCategoryService } from './categories/categories.service';
import { ProductSegmentService } from './segment/segment.service';
import { ProductSubcategoryService } from './sub-categories/sub-categories.service';
import { Errors } from '../../errors/errors';
import { transformSegment } from '../../shared/transformers/product.transformer';
import { IPagination } from '../../shared/pagination/pagination.interface';
import { PaginationHeaderHelper } from '../../shared/pagination/pagination.helper';
import * as _ from 'lodash';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly productSegmentService: ProductSegmentService,
    private readonly productCategoryService: ProductCategoryService,
    private readonly productSubcategoryService: ProductSubcategoryService,
    private readonly paginationHeaderHelper: PaginationHeaderHelper,
  ) {}

  async create(dto: CreateProductDto) {
    const category = await this.productCategoryService.findOneCategoryById(
      dto.categoryId,
    );
    if (!category) {
      throw new BadRequestException(Errors.CATEGORY_NOT_FOUND);
    }
    const subCategory =
      await this.productSubcategoryService.findOneSubCategoryById(
        dto.subCategoryId,
      );
    if (!subCategory) {
      throw new BadRequestException(Errors.SUBCATEGORY_NOT_FOUND);
    }
    const segment = await this.productSegmentService.findSegmentByCategoryId(
      category._id,
    );
    if (!segment) {
      throw new BadRequestException(Errors.SEGMENT_NOT_FOUND);
    }

    let totalQuantity = 0;

    if (dto.variants && dto.variants.length > 0) {
      dto.variants.forEach((variant) => {
        if (variant.sizes && variant.sizes.length > 0) {
          variant.sizes.forEach((size) => {
            totalQuantity += size.quantity;
          });
        }
      });
    }

    const payload = {
      ...dto,
      totalQuantity,
      segment: transformSegment(segment, category, subCategory),
    };
    return await this.productRepository.create(payload);
  }

  async archive(id: string) {
    return await this.productRepository.updateById(id, {
      isArchived: true,
    });
  }

  async findNewArrivals(pagination: IPagination) {
    return this.findProducts(pagination, 'createdAt', -1);
  }

  async findBestSellers(pagination: IPagination) {
    return this.findProducts(pagination, 'totalSoldQuantity', -1);
  }

  async findProducts(
    pagination: IPagination,
    sortField: string,
    sortOrder: number,
  ) {
    const findParams: any = {
      isArchived: false,
      isActive: true,
    };

    const options = {
      limit: pagination.perPage,
      skip: pagination.startIndex,
      sort: { [sortField]: sortOrder },
    };

    const products = await this.productRepository.find(findParams, options);
    const total = await this.productRepository.count(findParams);

    const responseHeaders = this.paginationHeaderHelper.getHeaders(
      pagination,
      total,
    );

    return {
      headers: responseHeaders,
      items: products,
    };
  }

  async updateBasicInfo(productId: string, dto: UpdateProductDto) {
    // Fetch the existing product
    const existingProduct = await this.productRepository.findById(productId);
    if (!existingProduct) {
      throw new BadRequestException(Errors.PRODUCT_NOT_FOUND);
    }

    let newSegment = existingProduct.segment;
    // If the segment or categories change, find the new segment
    if (
      dto.segmentId !== String(existingProduct.segment.id) ||
      dto.categoryId !== String(existingProduct.segment.categories.id) ||
      dto.subCategoryId !==
        String(existingProduct.segment.categories.subcategories.id)
    ) {
      const category = await this.productCategoryService.findOneCategoryById(
        dto.categoryId,
      );
      if (!category) {
        throw new BadRequestException(Errors.CATEGORY_NOT_FOUND);
      }

      const subCategory =
        await this.productSubcategoryService.findOneSubCategoryById(
          dto.subCategoryId,
        );
      if (!subCategory) {
        throw new BadRequestException(Errors.SUBCATEGORY_NOT_FOUND);
      }

      const segment = await this.productSegmentService.findSegmentByCategoryId(
        category._id,
      );
      if (!segment) {
        throw new BadRequestException(Errors.SEGMENT_NOT_FOUND);
      }

      newSegment = transformSegment(segment, category, subCategory);
    }

    const payload = {
      name: dto.name,
      description: dto.description,
      price: dto.price,
      isActive: dto.isActive,
      isArchived: dto.isArchived,
      segment: newSegment,
    };

    return await this.productRepository.updateById(productId, payload);
  }

  async updateSaleInfo(productId: string, dto: UpdateSaleDto) {
    const existingProduct = await this.productRepository.findById(productId);
    if (!existingProduct) {
      throw new BadRequestException(Errors.PRODUCT_NOT_FOUND);
    }
    console.log(existingProduct);
    console.log(productId, dto);
    // return await this.productRepository.updateById(productId, dto);
  }
}
