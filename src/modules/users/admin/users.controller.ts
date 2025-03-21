import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
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

import { Pagination } from '../../../shared/pagination/pagination.decorator';
import {
  ApiPagination,
  IPagination,
} from '../../../shared/pagination/pagination.interface';
import { Roles } from '../../auth/decorator/roles.decorator';
import { JWTAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';

import { UsersService } from './users.service';
import { EApiTags, ERole } from '../../../shared/enum';
import {
  CreateUserDto,
  GetUsersDto,
  UpdateUserDto,
} from '../dto/resquest/user.dto';

@ApiTags(EApiTags.USER)
@Controller('users')
@ApiBearerAuth()
// @UseGuards(JWTAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create')
  // @Roles(ERole.SUPER_ADMIN)
  @ApiOperation({
    description: 'to create user',
    operationId: 'createUser',
  })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createProfileDto: CreateUserDto) {
    return await this.usersService.createUser(createProfileDto);
  }
}
