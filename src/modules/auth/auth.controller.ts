import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { EApiTags } from '../../shared/enum';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ILoginRequest } from './interface/auth.interface';

@UseGuards()
@ApiTags(EApiTags.AUTH)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
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
  async login(@Req() req: ILoginRequest) {
    return await this.authService.login(req.user);
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
}
