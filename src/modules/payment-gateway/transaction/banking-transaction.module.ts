import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  BankingTransaction,
  BankingTransactionSchema,
} from './banking-transaction.schema';
import { BankingTransactionRepository } from './banking-transaction.repository';
import { BankingTransactionService } from './banking-transaction.service';

@Module({
  exports: [BankingTransactionService],
  imports: [
    MongooseModule.forFeature([
      { name: BankingTransaction.name, schema: BankingTransactionSchema },
    ]),
  ],
  providers: [BankingTransactionService, BankingTransactionRepository],
})
export class BankingTransactionModule {}
