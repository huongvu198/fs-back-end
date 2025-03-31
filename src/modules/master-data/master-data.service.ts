import { BadGatewayException, Injectable } from '@nestjs/common';

import { UpdateMasterDataDto } from './dto/update-master-data.dto';
import { MasterDataRepository } from './master-data.repository';
import { MasterDataEnum } from '../../shared/enum';

@Injectable()
export class MasterDataService {
  constructor(private readonly masterDataRepository: MasterDataRepository) {}

  async updateMasterData(dto: UpdateMasterDataDto) {
    const _id = dto._id;
    const masterData = await this.masterDataRepository.findOne({
      _id,
    });
    if (!masterData) {
      throw new BadGatewayException('Not found');
    }
    const result = await this.masterDataRepository.updateOne(
      { _id },
      { data: dto.data },
    );
    return result;
  }
  async findMasterData() {
    const masterData = await this.masterDataRepository.findOne(
      {
        type: MasterDataEnum.MASTER,
      },
      { projection: { _id: 1, data: 1 } },
    );
    return masterData;
  }

  async getRezPointData() {
    const masterData = await this.findMasterData();
    return masterData?.data?.rezPoint ?? {};
  }
}
