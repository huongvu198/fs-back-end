import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from '../admin/users.service';
import { Errors } from '../../../errors/errors';
import { transformPhoneNumber } from '../../../shared/transformers/phone.transformer';
import { AuthProvidersEnum, VerifyCodeEnum } from '../../../shared/enum';
import { lowerCaseTransformer } from '../../../shared/transformers/lower-case.transformer';
import {
  AddAddressDto,
  CreateCustomerDto,
  ResendCodeVerifyDto,
  UpdateCustomerDto,
  VerifyAccountDto,
} from '../dto/resquest/customer.dto';
import {
  AddAddressResponse,
  CreateCustomerResponse,
  CustomerDetailResponse,
  RemoveAddressResponse,
  UpdateCustomerResponse,
} from '../dto/reponse/customer.response';
import { CustomersRepository } from './customers.repository';
import { MailService } from '../../send-mail/mail.service';
import { generateVerifyAccountInfo } from '../../../shared/helpers/common.helper';
import dayjs from 'dayjs';
import { CustomerDocument } from './customers.schema';
import { NullableType } from '../../../shared/types/nullable.type';

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

    const verifyAccount = generateVerifyAccountInfo(
      VerifyCodeEnum.CREATE_ACCOUNT,
    );

    const userPayload = {
      name: createProfileDto.name,
      email: lowerCaseTransformer(createProfileDto.email),
      phoneNumber: phoneNumber,
      password,
      provider: AuthProvidersEnum.EMAIL,
      verifyAccount: [verifyAccount],
    };

    const result = await this.customersRepository.create(userPayload);

    if (!result) {
      throw new BadRequestException(Errors.CREATE_CUSTOMER_FAILED);
    }

    this.mailService.verifyAccount({
      data: {
        name: userPayload.name,
        customer: result._id.toString(),
        code: verifyAccount.code,
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

  async verifyAccount(dto: VerifyAccountDto) {
    const customer = await this.customersRepository.findById(dto.customerId);
    if (!customer) throw new BadRequestException(Errors.USER_NOT_FOUND);

    const verifyData = customer.verifyAccount.find(
      (v) => v.code === dto.code && v.valid === true,
    );

    if (!verifyData) {
      throw new BadRequestException(Errors.INVALID_VERIFYCATION_CODE);
    }

    const codeExpiresStore = dayjs(verifyData.codeExpires);
    const codeExpires = dayjs(Number(dto.codeExpires));

    if (codeExpires.isBefore(codeExpiresStore)) {
      throw new BadRequestException(Errors.EXPIRED_VERIFYCATION_CODE);
    }

    await this.customersRepository.updateById(dto.customerId, {
      $set: {
        isActivate: true,
        isVerify: true,
        'verifyAccount.$[].valid': false,
      },
    });

    return customer;
  }

  async resendCodeVerify(dto: ResendCodeVerifyDto) {
    const customer = await this.customersRepository.findOne({
      email: dto.email,
    });

    if (!customer) throw new BadRequestException(Errors.USER_NOT_FOUND);

    const customerId = customer._id.toString();

    await this.customersRepository.updateById(customerId, {
      $set: { 'verifyAccount.$[].valid': false },
    });

    const newVerifyData = generateVerifyAccountInfo(VerifyCodeEnum.RESEND_CODE);

    await this.mailService.verifyAccount({
      data: {
        name: customer.name,
        customer: customerId,
        codeExpires: newVerifyData.codeExpires,
        code: newVerifyData.code,
      },
      to: customer.email,
    });

    await this.customersRepository.updateById(customerId, {
      $push: { verifyAccount: newVerifyData },
    });
  }

  async findCustomerByEmail(
    email: string,
  ): Promise<NullableType<CustomerDocument>> {
    const user: CustomerDocument = await this.customersRepository.findOne({
      email: lowerCaseTransformer(email),
    });

    if (!user) {
      throw new NotFoundException(Errors.USER_NOT_FOUND);
    }

    return user;
  }
}
