import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { Logger } from '@nestjs/common';

import { Errors } from '../../errors/errors';
import { RoleRepository } from './roles.repository';
import { Role } from './roles.schema';
import { UpdateRoleDto } from './dto/request/update-role.dto';
import { CreateRoleDto } from './dto/request/create-role.dto';
import { ERole } from '../../shared/enum';

@Injectable()
export class RolesService implements OnModuleInit {
  constructor(private readonly roleRepository: RoleRepository) {}

  async onModuleInit() {
    await this.createRootRole();
  }

  async createRootRole() {
    const existingRoles = await this.roleRepository.find({
      name: { $in: [ERole.SUPER_ADMIN, ERole.ADMIN, ERole.CUSTOMER] },
    });

    const existingRoleNames = new Set(existingRoles.map((role) => role.name));

    const rolesToCreate = [
      {
        name: ERole.SUPER_ADMIN,
        description: 'ROOT ROLE CREATE BY SYSTEM',
      },
      {
        name: ERole.ADMIN,
        description: 'ROOT ROLE CREATE BY SYSTEM',
      },
      {
        name: ERole.CUSTOMER,
        description: 'ROOT ROLE CREATE BY SYSTEM',
      },
    ].filter((role) => !existingRoleNames.has(role.name));

    if (rolesToCreate.length > 0) {
      await this.roleRepository.create(rolesToCreate);
      Logger.log(
        `Created missing roles: ${rolesToCreate.map((r) => r.name).join(', ')}`,
      );
    }
  }

  async createRole(createRoleDto: CreateRoleDto): Promise<Role> {
    return await this.roleRepository.create(createRoleDto);
  }

  async updateRole(id: string, dto: UpdateRoleDto) {
    const role = await this.roleRepository.findById(id);

    if (!role) {
      throw new NotFoundException(Errors.ROLE_NOT_FOUND);
    }

    return await this.roleRepository.updateOne({ _id: id }, dto);
  }

  async getRoles() {
    return await this.roleRepository.findAll();
  }

  async findRoleById(id: string) {
    const role = await this.roleRepository.findById(id);

    if (!role) {
      throw new NotFoundException(Errors.ROLE_NOT_FOUND);
    }

    return role;
  }

  async findRoleByName(name: string) {
    const role = await this.roleRepository.findOne({ name });

    if (!role) {
      throw new NotFoundException(Errors.ROLE_NOT_FOUND);
    }

    return role;
  }
}
