import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { BaseRepository } from '../../../shared/mongo/mongoose';
import { User, UserDocument } from './users.schema';

@Injectable()
export class UsersRepository
  extends BaseRepository<UserDocument>
  implements OnApplicationBootstrap
{
  constructor(@InjectModel(User.name) model: Model<UserDocument>) {
    super(model);
  }

  async onApplicationBootstrap(): Promise<void> {
    await this.createCollection();
  }
}
