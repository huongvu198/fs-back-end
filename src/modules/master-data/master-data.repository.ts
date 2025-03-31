import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { BaseRepository } from '../../shared/mongo/mongoose';
import { MasterData, MasterDataDocument } from './master-data.schema';

@Injectable()
export class MasterDataRepository
  extends BaseRepository<MasterDataDocument>
  implements OnApplicationBootstrap
{
  constructor(@InjectModel(MasterData.name) model: Model<MasterDataDocument>) {
    super(model);
  }

  async onApplicationBootstrap(): Promise<void> {
    await this.createCollection();
  }
}
