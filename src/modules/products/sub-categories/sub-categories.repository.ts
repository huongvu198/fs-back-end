import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '../../../shared/mongo/mongoose';
import {
  ProductSubcategory,
  ProductSubcategoryDocument,
} from './sub-categories.schema';

@Injectable()
export class ProductSubCategoryRepository
  extends BaseRepository<ProductSubcategoryDocument>
  implements OnApplicationBootstrap
{
  constructor(
    @InjectModel(ProductSubcategory.name)
    model: Model<ProductSubcategoryDocument>,
  ) {
    super(model);
  }

  async onApplicationBootstrap(): Promise<void> {
    await this.createCollection();
  }
}
