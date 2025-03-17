import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { BaseRepository } from '../../shared/mongo/mongoose';
import { Session, SessionDocument } from './session.schema';

@Injectable()
export class SessionRepository
  extends BaseRepository<SessionDocument>
  implements OnApplicationBootstrap
{
  constructor(@InjectModel(Session.name) model: Model<SessionDocument>) {
    super(model);
  }

  async onApplicationBootstrap(): Promise<void> {
    await this.createCollection();
  }
}
