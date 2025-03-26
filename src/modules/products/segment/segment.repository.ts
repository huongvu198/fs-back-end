import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductSegment, ProductSegmentDocument } from './segment.schema';
import { BaseRepository } from '../../../shared/mongo/mongoose';
import { SegmentDto } from './dto/segment.response.dto';

@Injectable()
export class ProductSegmentRepository
  extends BaseRepository<ProductSegmentDocument>
  implements OnApplicationBootstrap
{
  constructor(
    @InjectModel(ProductSegment.name) model: Model<ProductSegmentDocument>,
  ) {
    super(model);
  }

  async onApplicationBootstrap(): Promise<void> {
    await this.createCollection();
  }

  async findAllSegmentWithPopulate() {
    const segments = await this.model.find().populate({
      path: 'categories',
      populate: {
        path: 'subcategories',
      },
    });
    return segments.map((segment) => new SegmentDto(segment));
  }
}
