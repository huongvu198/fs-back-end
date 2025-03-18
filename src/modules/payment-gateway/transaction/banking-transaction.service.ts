import { Injectable } from '@nestjs/common';
import { BankingTransactionRepository } from './banking-transaction.repository';

@Injectable()
export class BankingTransactionService {
  constructor(
    private readonly bankingTransactionRepository: BankingTransactionRepository,
  ) {}
}
