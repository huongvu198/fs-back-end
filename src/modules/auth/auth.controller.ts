import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { EApiTags } from '../../shared/enum';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import {
  LoginCustomerResponseDto,
  LoginResponseDto,
} from './dto/login-response.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import {
  ICustomerLoginRequest,
  ILoginRequest,
} from './interface/auth.interface';
import { LocalCustomerAuthGuard } from './guards/local-customer-auth.guard';

@UseGuards()
@ApiTags(EApiTags.AUTH)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('user-login')
  @ApiOperation({
    description: 'to login',
    operationId: 'login',
  })
  @ApiBody({ type: AuthLoginDto })
  @UseGuards(LocalAuthGuard)
  @ApiOkResponse({
    type: LoginResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  async loginUser(@Req() req: ILoginRequest) {
    return await this.authService.login(req.user);
  }

  @Post('customer-login')
  @ApiOperation({
    description: 'to loginCustomer',
    operationId: 'loginCustomer',
  })
  @ApiBody({ type: AuthLoginDto })
  @UseGuards(LocalCustomerAuthGuard)
  @ApiOkResponse({
    type: LoginCustomerResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  async loginCustomer(@Req() req: ICustomerLoginRequest) {
    return await this.authService.loginCustomer(req.user);
  }

  @Post('forgot-password')
  @ApiOperation({
    description: 'to forgot password',
    operationId: 'forgotPassword',
  })
  async forgotPassword(@Body() { email }: ForgotPasswordDto) {
    return await this.authService.forgotPassword(email);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    description: 'to reset password',
    operationId: 'resetPassword',
  })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return await this.authService.resetPassword(resetPasswordDto);
  }

  @Post('logout/:sessionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    description: 'to logout',
    operationId: 'logout',
  })
  @ApiParam({
    name: 'sessionId',
    required: true,
    type: String,
  })
  async logout(@Param('sessionId') sessionId: string) {
    return await this.authService.logout(sessionId);
  }
}
