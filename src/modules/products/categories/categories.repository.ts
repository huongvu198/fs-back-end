import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '../../../shared/mongo/mongoose';
import { ProductCategory, ProductCategoryDocument } from './categories.schema';

@Injectable()
export class ProductCategoryRepository
  extends BaseRepository<ProductCategoryDocument>
  implements OnApplicationBootstrap
{
  constructor(
    @InjectModel(ProductCategory.name) model: Model<ProductCategoryDocument>,
  ) {
    super(model);
  }

  async onApplicationBootstrap(): Promise<void> {
    await this.createCollection();
  }
}
