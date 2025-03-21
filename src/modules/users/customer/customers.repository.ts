import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { BaseRepository } from '../../../shared/mongo/mongoose';
import { Customer, CustomerDocument } from './customers.schema';

@Injectable()
export class CustomersRepository
  extends BaseRepository<CustomerDocument>
  implements OnApplicationBootstrap
{
  constructor(@InjectModel(Customer.name) model: Model<CustomerDocument>) {
    super(model);
  }

  async onApplicationBootstrap(): Promise<void> {
    await this.createCollection();
  }
}
