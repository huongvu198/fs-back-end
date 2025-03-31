import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { MasterData, MasterDataSchema } from './master-data.schema';
import { MasterDataController } from './master-data.controller';
import { MasterDataService } from './master-data.service';
import { MasterDataRepository } from './master-data.repository';

@Module({
  controllers: [MasterDataController],
  exports: [MasterDataService],
  imports: [
    MongooseModule.forFeature([
      { name: MasterData.name, schema: MasterDataSchema },
    ]),
  ],
  providers: [MasterDataService, MasterDataRepository],
})
export class MasterDataModule {}
