import { ApiProperty } from '@nestjs/swagger';
import { Address } from '../../users.schema';

export class CreateCustomerResponse {
  _id: string;
  email: string;
  name: string;
  phoneNumber: string;
}

export class UpdateCustomerResponse {
  _id: string;
  email: string;
  name: string;
  phoneNumber: string;
}

export class AddressResponse {
  _id: string;
  email: string;
  name: string;
  phoneNumber: string;
  addresses: Address[];
}

export class AddAddressResponse extends AddressResponse {}

export class RemoveAddressResponse extends AddressResponse {}

export class CustomerDetailResponse extends AddressResponse {}
