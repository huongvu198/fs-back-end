import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PaginationHeaderHelper } from '../../shared/pagination/pagination.helper';
import { RolesModule } from '../roles/roles.module';
import { UsersService } from './admin/users.service';
import { UsersRepository } from './admin/users.repository';
import { User, UserSchema } from './admin/users.schema';
import { UsersController } from './admin/users.controller';
import { CustomersService } from './customer/customers.service';
import { CustomersRepository } from './customer/customers.repository';
import { Customer, CustomerSchema } from './customer/customers.schema';
import { MailModule } from '../send-mail/mail.module';
import { CustomerController } from './customer/customers.controller';

@Module({
  controllers: [UsersController, CustomerController],
  exports: [UsersService, UsersRepository, CustomersService],
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Customer.name, schema: CustomerSchema },
    ]),
    RolesModule,
    MailModule,
  ],
  providers: [
    UsersService,
    CustomersService,
    PaginationHeaderHelper,
    UsersRepository,
    CustomersRepository,
  ],
})
export class UsersModule {}
