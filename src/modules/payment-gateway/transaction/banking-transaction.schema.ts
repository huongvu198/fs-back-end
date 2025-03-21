import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { User } from '../../users/admin/users.schema';
import { TransactionStatus } from './transaction.constants';

export type BankingTransactionDocument = HydratedDocument<BankingTransaction>;

@Schema({ collection: 'banking-transaction', timestamps: true })
export class BankingTransaction {
  @Prop({ required: false, type: String })
  userId?: string;

  @Prop({ default: 0, required: true, type: Number })
  amount: number;

  @Prop({ default: '182381323123', required: true, type: String })
  transactionId: string;

  @Prop({
    default: TransactionStatus.SUCCESS,
    enum: TransactionStatus,
    type: String,
  })
  status?: string;

  @Prop({ required: false, type: Object })
  rawData?: Record<string, any>;
}

export const BankingTransactionSchema =
  SchemaFactory.createForClass(BankingTransaction);

BankingTransactionSchema.index({ user: 1 });
