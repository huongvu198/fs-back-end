import { Controller, Post, Body, Res, Logger } from '@nestjs/common';
import { EApiTags } from '../../shared/enum';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BankTransaction } from './interface/webhook.interface';

@ApiTags(EApiTags.WEBHOOK)
@Controller('webhook')
export class WebhookController {
  constructor() {}

  @Post()
  @ApiOperation({
    description: 'receive Transaction Banking',
    operationId: 'receiveTransactionBanking',
  })
  async handleTransactionPayment(@Body() data: BankTransaction) {
    if (typeof data !== 'object') {
      Logger.log('Webhook banking return no data');
    }

    Logger.log('data', data);
    //TODO: something
  }
}
