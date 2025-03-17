import { Controller, Post, Body, Res, Logger } from '@nestjs/common';
import { EApiTags } from '../../shared/enum';
import { ApiTags } from '@nestjs/swagger';

@ApiTags(EApiTags.WEBHOOK)
@Controller('webhook')
export class WebhookController {
  constructor() {}

  @Post()
  async handleTransactionPayment(@Body() data: any, @Res() res: any) {
    if (typeof data !== 'object') {
      Logger.log('Webhook banking return no data');
    }

    Logger.log(
      'handleTransactionPayment',
      JSON.stringify(data),
      JSON.stringify(res),
    );
    //TODO: something
  }
}
