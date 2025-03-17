import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';
import { RolesService } from '../roles/roles.service';
import { Errors } from '../../errors/errors';
import { transformPhoneNumber } from '../../shared/transformers/phone.transformer';
import { AuthProvidersEnum, ERole } from '../../shared/enum';
import { lowerCaseTransformer } from '../../shared/transformers/lower-case.transformer';
import {
  AddAddressDto,
  CreateCustomerDto,
  UpdateCustomerDto,
} from './dto/resquest/customer.dto';
import {
  AddAddressResponse,
  AddressResponse,
  CreateCustomerResponse,
  CustomerDetailResponse,
  RemoveAddressResponse,
  UpdateCustomerResponse,
} from './dto/reponse/customer.response';

@Injectable()
export class CustomersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
  ) {}

  async createCustomer(
    createProfileDto: CreateCustomerDto,
  ): Promise<CreateCustomerResponse> {
    const existingUser = await this.usersService.findExistingUserByEmail(
      createProfileDto.email,
    );

    if (existingUser) {
      throw new BadRequestException(Errors.EMAIL_ALREADY_EXISTS);
    }
    const role = await this.rolesService.findRoleByName(ERole.CUSTOMER);

    const phoneNumber = transformPhoneNumber(createProfileDto.phoneNumber);

    if (!phoneNumber) {
      throw new BadRequestException(Errors.INVALID_FORMAT_PHONE_NUMBER);
    }

    const password = await this.usersService.generatePassword(
      createProfileDto.password,
    );

    const userPayload = {
      name: createProfileDto.name,
      email: lowerCaseTransformer(createProfileDto.email),
      phoneNumber: phoneNumber,
      password,
      provider: AuthProvidersEnum.EMAIL,
      role: {
        _id: role._id.toString(),
        name: role.name,
      },
    };

    const result = await this.usersRepository.create(userPayload);
    return {
      email: result.email,
      name: result.name,
      phoneNumber: result.phoneNumber,
      _id: result._id.toString(),
    };
  }

  async getCustomerDetail(id: string): Promise<CustomerDetailResponse> {
    const customer = await this.usersRepository.findById(id);
    if (!customer) {
      throw new BadRequestException(Errors.USER_NOT_FOUND);
    }

    return {
      _id: customer._id.toString(),
      name: customer.name,
      email: customer.email,
      phoneNumber: customer.phoneNumber,
      addresses: customer.addresses,
    };
  }

  async updateInfoCustomer(
    dto: UpdateCustomerDto,
  ): Promise<UpdateCustomerResponse> {
    const customer = await this.usersRepository.findById(dto._id);
    if (!customer) {
      throw new BadRequestException(Errors.USER_NOT_FOUND);
    }
    await this.usersRepository.updateById(dto._id, {
      name: dto.name,
      phoneNumber: dto.phoneNumber,
    });

    return {
      _id: dto._id,
      email: customer.email,
      name: dto.name,
      phoneNumber: dto.phoneNumber,
    };
  }

  async addAddressCustomer(
    id: string,
    dto: AddAddressDto,
  ): Promise<AddAddressResponse> {
    const customer = await this.usersRepository.updateById(
      id,
      { $push: { addresses: dto } },
      { new: true },
    );

    return {
      _id: customer._id.toString(),
      email: customer.email,
      name: customer.name,
      phoneNumber: customer.phoneNumber,
      addresses: customer.addresses,
    };
  }

  async removeAddressCustomer(
    customerId: string,
    addressId: string,
  ): Promise<RemoveAddressResponse> {
    const customer = await this.usersRepository.findById(customerId);
    if (!customer) {
      throw new BadRequestException(Errors.USER_NOT_FOUND);
    }

    const addressToRemove = customer.addresses.find(
      (address) => address._id.toString() === addressId,
    );

    if (addressToRemove.isDefault) {
      throw new BadRequestException(Errors.DEFAULT_ADDRESS);
    }

    const updatedCustomer = await this.usersRepository.updateById(
      customerId,
      { $pull: { addresses: { _id: addressId } } },
      { new: true },
    );

    return {
      _id: updatedCustomer._id.toString(),
      email: updatedCustomer.email,
      name: updatedCustomer.name,
      phoneNumber: updatedCustomer.phoneNumber,
      addresses: updatedCustomer.addresses,
    };
  }
}
