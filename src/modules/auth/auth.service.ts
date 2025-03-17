import {
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import ms from 'ms';

import { config } from '../../config/app.config';
import { Errors } from '../../errors/errors';
import { SessionService } from '../session/session.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { TokenData } from './dto/get-token-data.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ResponseUserAuth } from './interface/auth.interface';
import { UsersService } from '../users/users.service';
import { RedisCacheService } from '../../shared/redis-cache/redis-cache.service';
import { UserDocument } from '../users/users.schema';
import { AuthProvidersEnum } from '../../shared/enum';
import { Role } from '../roles/roles.schema';
import { MailService } from '../send-mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly sessionService: SessionService,
    private readonly mailService: MailService,
    private readonly redisCacheService: RedisCacheService,
  ) {}

  async validateLogin(loginDto: AuthLoginDto): Promise<UserDocument> {
    const user = await this.usersService.findUserByEmail(loginDto.email);

    if (!user) {
      throw new UnprocessableEntityException(Errors.INCORRECT_EMAIL);
    }

    if (user.provider !== AuthProvidersEnum.EMAIL) {
      throw new UnprocessableEntityException(Errors.INCORRECT_PROVIDER);
    }

    const isValidPassword = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isValidPassword) {
      throw new UnprocessableEntityException(Errors.INCORRECT_USER_INFO);
    }

    return user;
  }

  async login(user: UserDocument): Promise<LoginResponseDto> {
    const hash = crypto
      .createHash('sha256')
      .update(randomStringGenerator())
      .digest('hex');

    const session = await this.sessionService.create({ hash, user: user.id });
    const { token, refreshToken, tokenExpires } = await this.getTokensData({
      email: user.email,
      hash,
      id: user.id,
      name: user.name,
      role: (user.role as Role).name,
      sessionId: session.id,
    });

    return {
      refreshToken,
      token,
      tokenExpires,
      user: this.transformUser(user),
    };
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.usersService.findUserByEmail(email);

    if (!user) {
      throw new UnprocessableEntityException(Errors.INCORRECT_EMAIL);
    }

    const forgotExpiresIn = config.jwt.forgotExpiresIn;

    const tokenExpires = Date.now() + ms(forgotExpiresIn);

    const hash = await this.jwtService.signAsync(
      {
        forgotUserId: user.id,
      },
      {
        expiresIn: forgotExpiresIn,
        secret: config.jwt.forgotSecret,
      },
    );

    const redisKey = `resetPassword:${user.id}`;
    await this.redisCacheService.deleteByKey(redisKey);

    await this.redisCacheService.set(redisKey, hash, ms(forgotExpiresIn));

    await this.mailService.forgotPassword({
      data: {
        hash,
        tokenExpires,
      },
      to: email,
    });
  }

  async resetPassword({ hash, password }: ResetPasswordDto) {
    let userId: string;
    try {
      const jwtData = await this.jwtService.verifyAsync<{
        forgotUserId: string;
      }>(hash, {
        secret: config.jwt.forgotSecret,
      });

      userId = jwtData.forgotUserId;
    } catch (error) {
      throw new UnprocessableEntityException({
        errors: {
          hash: 'invalidHash',
        },
        status: HttpStatus.UNPROCESSABLE_ENTITY,
      });
    }

    const redisKey = `resetPassword:${userId}`;
    const storedToken = await this.redisCacheService.get(redisKey);
    if (storedToken !== hash) {
      throw new UnprocessableEntityException('Invalid or expired token');
    }

    const user: UserDocument = await this.usersService.getUserByUserId(userId);

    if (!user) {
      throw new UnprocessableEntityException({
        errors: {
          hash: 'notFound',
        },
        status: HttpStatus.UNPROCESSABLE_ENTITY,
      });
    }

    user.password = password;

    await this.sessionService.deleteByUserId(user.id);

    await this.usersService.updateUser(user.id, user);

    // await this.cacheManager.del(redisKey);
  }

  private async getTokensData(data: TokenData) {
    const tokenExpiresIn = config.jwt.expiresIn;

    const tokenExpires = Date.now() + ms(tokenExpiresIn);

    const [token, refreshToken] = await Promise.all([
      await this.jwtService.signAsync(
        {
          email: data.email,
          id: data.id,
          name: data.name,
          role: data.role,
          sessionId: data.sessionId,
        },
        {
          expiresIn: tokenExpiresIn,
          secret: config.jwt.secret,
        },
      ),
      await this.jwtService.signAsync(
        {
          hash: data.hash,
          sessionId: data.sessionId,
        },
        {
          expiresIn: config.jwt.refreshExpiresIn,
          secret: config.jwt.refreshSecret,
        },
      ),
    ]);

    return { refreshToken, token, tokenExpires };
  }

  transformUser(user: UserDocument): ResponseUserAuth {
    return {
      email: user.email,
      role: user.role.name,
    };
  }
}
