import { BadRequestException, Injectable } from '@nestjs/common';
import { Errors } from '../../../errors/errors';
import { convertToSlug } from '../../../shared/transformers/slug.transformer';
import { removeVietnameseTones } from '../../../shared/transformers/vietnamese.transformer';
import { ProductCategoryRepository } from './categories.repository';
import { CreateCategoryDto } from '../dto/category.request.dto';
import { ProductSegmentService } from '../segment/segment.service';

@Injectable()
export class ProductCategoryService {
  constructor(
    private readonly productCategoryRepository: ProductCategoryRepository,
    private readonly productSegmentService: ProductSegmentService,
  ) {}

  async create(dto: CreateCategoryDto) {
    const segment = await this.productSegmentService.findOneSegmentById(
      dto.segmentId,
    );

    if (!segment) {
      throw new BadRequestException(Errors.SEGMENT_NOT_FOUND);
    }

    const cateSlug = convertToSlug(removeVietnameseTones(dto.name));

    const found = await this.productCategoryRepository.findOne({ cateSlug });

    if (found) {
      throw new BadRequestException(Errors.PRODUCT_CATEGORY_EXISTED);
    }

    const newCategory = await this.productCategoryRepository.create({
      ...dto,
      segment: segment.id,
      cateSlug,
    });

    this.productSegmentService.updateCategoryBySegmentId(
      segment.id.toString(),
      newCategory,
    );

    return newCategory;
  }

  async findOneCategoryById(id: string) {
    return await this.productCategoryRepository.findById(id);
  }

  async updateCategoryByCategoryId(categoryId: string, newSubCategory: any) {
    return await this.productCategoryRepository.updateById(categoryId, {
      $push: { subcategories: newSubCategory },
    });
  }
}
