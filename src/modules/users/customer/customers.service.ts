import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../admin/users.service';
import { RolesService } from '../../roles/roles.service';
import { Errors } from '../../../errors/errors';
import { transformPhoneNumber } from '../../../shared/transformers/phone.transformer';
import { AuthProvidersEnum, ERole } from '../../../shared/enum';
import { lowerCaseTransformer } from '../../../shared/transformers/lower-case.transformer';
import {
  AddAddressDto,
  CreateCustomerDto,
  UpdateCustomerDto,
} from '../dto/resquest/customer.dto';
import {
  AddAddressResponse,
  CreateCustomerResponse,
  CustomerDetailResponse,
  RemoveAddressResponse,
  UpdateCustomerResponse,
} from '../dto/reponse/customer.response';
import { CustomersRepository } from './customers.repository';
import { VerifyAccount } from './customers.schema';
import dayjs from 'dayjs';
import { MailService } from '../../send-mail/mail.service';

@Injectable()
export class CustomersService {
  constructor(
    private readonly customersRepository: CustomersRepository,
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
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

    const phoneNumber = transformPhoneNumber(createProfileDto.phoneNumber);

    if (!phoneNumber) {
      throw new BadRequestException(Errors.INVALID_FORMAT_PHONE_NUMBER);
    }

    const password = await this.usersService.generatePassword(
      createProfileDto.password,
    );

    const verifyAccount = this.generateVerifyAccountInfo();

    const userPayload = {
      name: createProfileDto.name,
      email: lowerCaseTransformer(createProfileDto.email),
      phoneNumber: phoneNumber,
      password,
      provider: AuthProvidersEnum.EMAIL,
      isActivate: true,
      verifyAccount: [verifyAccount],
    };

    const result = await this.customersRepository.create(userPayload);

    if (!result) {
      throw new BadRequestException(Errors.CREATE_CUSTOMER_FAILED);
    }

    this.mailService.verifyAccount({
      data: {
        customer: result._id.toString(),
        codeExpires: verifyAccount.codeExpires,
      },
      to: result.email,
    });

    return {
      email: result.email,
      name: result.name,
      phoneNumber: result.phoneNumber,
      _id: result._id.toString(),
    };
  }

  async getCustomerDetail(id: string): Promise<CustomerDetailResponse> {
    const customer = await this.customersRepository.findById(id);
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
    const customer = await this.customersRepository.findById(dto._id);
    if (!customer) {
      throw new BadRequestException(Errors.USER_NOT_FOUND);
    }
    await this.customersRepository.updateById(dto._id, {
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
    const customer = await this.customersRepository.updateById(
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
    const customer = await this.customersRepository.findById(customerId);
    if (!customer) {
      throw new BadRequestException(Errors.USER_NOT_FOUND);
    }

    const addressToRemove = customer.addresses.find(
      (address) => address._id.toString() === addressId,
    );

    if (addressToRemove.isDefault) {
      throw new BadRequestException(Errors.DEFAULT_ADDRESS);
    }

    const updatedCustomer = await this.customersRepository.updateById(
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

  generateVerifyAccountInfo() {
    const verifyAccount: VerifyAccount = {
      isVerify: false,
      code: Math.floor(100000 + Math.random() * 900000).toString(),
      codeExpires: dayjs().add(15, 'minutes').toDate(),
    };

    return verifyAccount;
  }
}
