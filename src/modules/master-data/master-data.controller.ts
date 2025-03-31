import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { Roles } from '../auth/decorator/roles.decorator';
import { JWTAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateMasterDataDto } from './dto/update-master-data.dto';
import { EApiCmsTags } from '../../shared/enum';
import { MasterDataService } from './master-data.service';

// @UseGuards(CmsGuard)
@ApiTags(EApiCmsTags.MASTER_DATA)
@Controller('cms/master-data')
// @ApiBearerAuth()
// @UseGuards(JWTAuthGuard)
export class MasterDataController {
  constructor(private readonly masterDataService: MasterDataService) {}

  @Post('update')
  // @Roles(ERole.SUPER_ADMIN)
  @ApiOperation({
    description: 'to create masterData',
    operationId: 'createMasterData',
  })
  @HttpCode(HttpStatus.CREATED)
  async update(@Body() updateMasterDataDto: UpdateMasterDataDto) {
    return await this.masterDataService.updateMasterData(updateMasterDataDto);
  }

  @Get()
  @ApiOperation({
    description: 'to get masterData',
    operationId: 'getMasterData',
  })
  @HttpCode(HttpStatus.OK)
  async getMasterData() {
    return await this.masterDataService.findMasterData();
  }
}
