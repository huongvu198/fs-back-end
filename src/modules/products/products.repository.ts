import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './products.schema';
import { BaseRepository } from '../../shared/mongo/mongoose';

@Injectable()
export class ProductRepository
  extends BaseRepository<ProductDocument>
  implements OnApplicationBootstrap
{
  constructor(@InjectModel(Product.name) model: Model<ProductDocument>) {
    super(model);
  }

  async onApplicationBootstrap(): Promise<void> {
    await this.createCollection();
  }
}
