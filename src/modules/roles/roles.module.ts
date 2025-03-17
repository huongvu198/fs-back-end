import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { RoleRepository } from './roles.repository';
import { Role, RoleSchema } from './roles.schema';
import { RolesService } from './roles.service';

@Module({
  exports: [RolesService],
  imports: [
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
  ],
  providers: [RolesService, RoleRepository],
})
export class RolesModule {}
