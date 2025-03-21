import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { Roles } from '../../auth/decorator/roles.decorator';
import { JWTAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';

import { EApiTags, ERole } from '../../../shared/enum';
import { CustomersService } from './customers.service';
import {
  AddAddressDto,
  CreateCustomerDto,
  UpdateCustomerDto,
} from '../dto/resquest/customer.dto';
import {
  AddAddressResponse,
  CustomerDetailResponse,
  RemoveAddressResponse,
  UpdateCustomerResponse,
} from '../dto/reponse/customer.response';

@ApiTags(EApiTags.CUSTOMER)
@Controller('customer')
export class CustomerController {
  constructor(private readonly customersService: CustomersService) {}

  @Get('detail/:id')
  @ApiBearerAuth()
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Roles(ERole.CUSTOMER)
  @ApiOperation({
    description: 'to get customer detail',
    operationId: 'getDetailCustomer',
  })
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
  })
  @HttpCode(HttpStatus.OK)
  async getDetailCustomer(
    @Param('id') id: string,
  ): Promise<CustomerDetailResponse> {
    return await this.customersService.getCustomerDetail(id);
  }

  @Post('create')
  @ApiOperation({
    description: 'to create customer',
    operationId: 'createCustomer',
  })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createProfileDto: CreateCustomerDto) {
    return await this.customersService.createCustomer(createProfileDto);
  }

  @Post('update')
  @Roles(ERole.CUSTOMER)
  @ApiBearerAuth()
  @UseGuards(JWTAuthGuard, RolesGuard)
  @ApiOperation({
    description: 'to update customer',
    operationId: 'updateCustomer',
  })
  @HttpCode(HttpStatus.OK)
  async updateInfoCustomer(
    @Body() updateCustomerDto: UpdateCustomerDto,
  ): Promise<UpdateCustomerResponse> {
    return await this.customersService.updateInfoCustomer(updateCustomerDto);
  }

  @Post('/:id/add-address')
  @ApiBearerAuth()
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Roles(ERole.CUSTOMER)
  @ApiOperation({
    description: 'to add address',
    operationId: 'addAddress',
  })
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
  })
  @HttpCode(HttpStatus.OK)
  async addAddressCustomer(
    @Param('id') id: string,
    @Body() dto: AddAddressDto,
  ): Promise<AddAddressResponse> {
    return await this.customersService.addAddressCustomer(id, dto);
  }

  @Post('/:id/remove-address/:addressId')
  @Roles(ERole.CUSTOMER)
  @ApiOperation({
    description: 'to remove address',
    operationId: 'removeAddress',
  })
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
  })
  @ApiParam({
    name: 'addressId',
    required: true,
    type: String,
  })
  @HttpCode(HttpStatus.OK)
  async removeAddressCustomer(
    @Param('id') id: string,
    @Param('addressId') addressId: string,
  ): Promise<RemoveAddressResponse> {
    return await this.customersService.removeAddressCustomer(id, addressId);
  }
}
