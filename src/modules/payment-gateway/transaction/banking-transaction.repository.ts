import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '../../../shared/mongo/mongoose';
import {
  BankingTransaction,
  BankingTransactionDocument,
} from './banking-transaction.schema';

@Injectable()
export class BankingTransactionRepository
  extends BaseRepository<BankingTransactionDocument>
  implements OnApplicationBootstrap
{
  constructor(
    @InjectModel(BankingTransaction.name)
    model: Model<BankingTransactionDocument>,
  ) {
    super(model);
  }

  async onApplicationBootstrap(): Promise<void> {
    await this.createCollection();
  }
}
