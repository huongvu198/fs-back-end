import { Controller, Post, Body, Res, Logger } from '@nestjs/common';
import { EApiTags } from '../../shared/enum';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags(EApiTags.WEBHOOK)
@Controller('webhook')
export class WebhookController {
  constructor() {}

  @Post()
  @ApiOperation({
    description: 'receive Transaction Banking',
    operationId: 'receiveTransactionBanking',
  })
  async handleTransactionPayment(@Body() data: any, @Res() res: any) {
    if (typeof data !== 'object') {
      Logger.log('Webhook banking return no data');
    }

    Logger.log('data', data);
    //TODO: something
  }
}
