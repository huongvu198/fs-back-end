import { BadRequestException, Injectable } from '@nestjs/common';
import { ProductSegmentRepository } from './segment.repository';
import { CreateSegmentDto } from './dto/segment.request.dto';
import { Errors } from '../../../errors/errors';
import { convertToSlug } from '../../../shared/transformers/slug.transformer';
import { removeVietnameseTones } from '../../../shared/transformers/vietnamese.transformer';
import { ObjectId } from 'mongodb';

@Injectable()
export class ProductSegmentService {
  constructor(
    private readonly productSegmentRepository: ProductSegmentRepository,
  ) {}

  async create(dto: CreateSegmentDto) {
    const slug = convertToSlug(removeVietnameseTones(dto.name));

    const found = await this.productSegmentRepository.findOne({ slug });

    if (found) {
      throw new BadRequestException(Errors.SEGMENT_EXISTED);
    }

    const newSegment = await this.productSegmentRepository.create({
      ...dto,
      slug,
    });

    return newSegment;
  }

  async findOneSegmentById(id: string) {
    return await this.productSegmentRepository.findById(id);
  }

  async findAllSegmentWithPopulate() {
    return await this.productSegmentRepository.findAll();
  }

  async updateCategoryBySegmentId(segmentId: string, newCategory: any) {
    return await this.productSegmentRepository.updateById(segmentId, {
      $push: { categories: newCategory },
    });
  }

  async updateSubcateForCategoryInSegment(
    segmentId: ObjectId,
    categoryId: ObjectId,
    subcategories: any,
  ) {
    return await this.productSegmentRepository.updateOne(
      {
        _id: segmentId,
        'categories._id': categoryId,
      },
      {
        $push: { 'categories.$.subcategories': subcategories },
      },
    );
  }

  async findSegmentByCategoryId(categoryId: ObjectId) {
    return await this.productSegmentRepository.findOne({
      'categories._id': categoryId,
    });
  }
}
