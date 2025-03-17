import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PaginationHeaderHelper } from '../../shared/pagination/pagination.helper';
import { RolesModule } from '../roles/roles.module';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { User, UserSchema } from './users.schema';
import { UsersController } from './users.controller';
import { CustomerController } from './customer.controller';
import { CustomersService } from './customer.service';

@Module({
  controllers: [UsersController, CustomerController],
  exports: [UsersService, UsersRepository, CustomersService],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    RolesModule,
  ],
  providers: [
    UsersService,
    CustomersService,
    PaginationHeaderHelper,
    UsersRepository,
  ],
})
export class UsersModule {}
