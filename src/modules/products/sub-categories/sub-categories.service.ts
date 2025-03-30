import { BadRequestException, Injectable } from '@nestjs/common';
import slugify from 'slugify';
import { Errors } from '../../../errors/errors';
import { convertToSlug } from '../../../shared/transformers/slug.transformer';
import { removeVietnameseTones } from '../../../shared/transformers/vietnamese.transformer';
import { ProductSubCategoryRepository } from './sub-categories.repository';
import { CreateSubCategoryDto } from '../dto/sub-category.request.dto';
import { ProductCategoryService } from '../categories/categories.service';
import { ProductSegmentService } from '../segment/segment.service';

@Injectable()
export class ProductSubcategoryService {
  constructor(
    private readonly productSubcategoryRepository: ProductSubCategoryRepository,
    private readonly productCategoryService: ProductCategoryService,
    private readonly productSegmentService: ProductSegmentService,
  ) {}

  async create(dto: CreateSubCategoryDto) {
    const category = await this.productCategoryService.findOneCategoryById(
      dto.categoryId,
    );

    if (!category) {
      throw new BadRequestException(Errors.CATEGORY_NOT_FOUND);
    }

    const segment = await this.productSegmentService.findSegmentByCategoryId(
      category._id,
    );

    if (!segment) {
      throw new BadRequestException(Errors.SEGMENT_NOT_FOUND);
    }

    const subCateSlug = convertToSlug(removeVietnameseTones(dto.name));

    const found = await this.productSubcategoryRepository.findOne({
      subCateSlug,
      categoryId: category._id.toString(),
    });

    if (found) {
      throw new BadRequestException(Errors.PRODUCT_SUBCATEGORY_EXISTED);
    }

    const newSubCate = await this.productSubcategoryRepository.create({
      ...dto,
      categoryId: category.id,
      subCateSlug,
    });

    this.productCategoryService.updateCategoryByCategoryId(
      category.id.toString(),
      newSubCate,
    );

    this.productSegmentService.updateSubcateBySegmentIdAndCategoryId(
      segment._id,
      category.id,
      newSubCate,
    );

    return newSubCate;
  }

  async findOneSubCategoryById(id: string) {
    return await this.productSubcategoryRepository.findById(id);
  }
}
