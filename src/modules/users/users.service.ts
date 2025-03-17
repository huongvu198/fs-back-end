import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { Logger } from '@nestjs/common';

import * as bcrypt from 'bcryptjs';

import { Errors } from '../../errors/errors';
import { DEFAULT_SORT } from '../../shared/mongo/mongoose';
import { PaginationHeaderHelper } from '../../shared/pagination/pagination.helper';
import {
  IPagination,
  IPaginationResponse,
} from '../../shared/pagination/pagination.interface';
import { lowerCaseTransformer } from '../../shared/transformers/lower-case.transformer';
import { RolesService } from '../roles/roles.service';
import { AuthProvidersEnum, ERole } from '../../shared/enum';
import { DeepPartial } from '../../shared/types/deep-partial.type';
import { NullableType } from '../../shared/types/nullable.type';
import { replaceQuerySearch } from '../../shared/helpers/common.helper';
import { UsersRepository } from './users.repository';
import { UserDocument } from './users.schema';
import { config } from '../../config/app.config';
import { transformPhoneNumber } from '../../shared/transformers/phone.transformer';
import { UserProfile } from './interface/user.interface';
import { CreateUserDto, GetUsersDto } from './dto/resquest/user.dto';
import { CreateUserResponse } from './dto/reponse/user.response';

const { email, password, phoneNumber } = config.root;

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly rolesService: RolesService,
    private readonly paginationHeaderHelper: PaginationHeaderHelper,
  ) {}

  async onModuleInit() {
    await this.createRootUser();
  }

  async createRootUser() {
    const existingUser = await this.usersRepository.findOne({
      email: email,
    });

    if (existingUser) return;

    const role = await this.rolesService.findRoleByName(ERole.SUPER_ADMIN);

    const passwordGenerate = await this.generatePassword(password);
    const userPayload = {
      email: email,
      password: passwordGenerate,
      phoneNumber: transformPhoneNumber(phoneNumber),
      provider: AuthProvidersEnum.EMAIL,
      role: {
        _id: role._id.toString(),
        name: role.name,
      },
    };

    await this.usersRepository.create({ ...userPayload });
    Logger.log('Create root user success!');
  }

  async createUser(
    createProfileDto: CreateUserDto,
  ): Promise<CreateUserResponse> {
    const role = await this.rolesService.findRoleById(createProfileDto.role);

    const existingUser = await this.findExistingUserByEmail(
      createProfileDto.email,
    );

    if (existingUser) {
      throw new BadRequestException(Errors.EMAIL_ALREADY_EXISTS);
    }

    const phoneNumber = transformPhoneNumber(createProfileDto.phoneNumber);

    if (!phoneNumber) {
      throw new BadRequestException(Errors.INVALID_FORMAT_PHONE_NUMBER);
    }

    const password = await this.generatePassword(createProfileDto.password);

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
      role: {
        _id: result.role._id,
        name: result.role.name,
      },
    };
  }

  async updateUser(id: string, payload: DeepPartial<UserDocument>) {
    const clonedPayload = { ...payload };

    if (
      clonedPayload.password &&
      clonedPayload.previousPassword !== clonedPayload.password
    ) {
      const salt = await bcrypt.genSalt();
      clonedPayload.password = await bcrypt.hash(clonedPayload.password, salt);
    }

    if (payload?.email) {
      const user = await this.usersRepository.findOne({
        email: lowerCaseTransformer(payload.email),
      });

      if (user && user.id !== id) {
        throw new BadRequestException(Errors.USER_EMAIL_ALREADY_EXISTS);
      }

      if (payload?.role) {
        await this.rolesService.findRoleById(payload.role as any);
      }
    }

    return this.usersRepository.updateOne({ _id: id }, clonedPayload);
  }

  async generatePassword(password: string) {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }

  async findUserByEmail(email: string): Promise<NullableType<UserDocument>> {
    const user: UserDocument = await this.usersRepository.findOne({
      email: lowerCaseTransformer(email),
    });

    if (!user) {
      throw new NotFoundException(Errors.USER_NOT_FOUND);
    }

    return user;
  }

  async findExistingUserByEmail(email: string) {
    return await this.usersRepository.findOne({
      email: lowerCaseTransformer(email),
    });
  }

  async findUserByQuery(query: any): Promise<NullableType<UserDocument>> {
    const user: UserDocument = await this.usersRepository.findOne(query);

    return user;
  }
  async getUserByUserId(userId: string) {
    return await this.usersRepository.findById(userId);
  }
}
