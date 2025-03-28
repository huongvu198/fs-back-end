import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';

import { config } from '../../config/app.config';
import { RedisCacheModule } from '../../shared/redis-cache/redis-cache.module';
import { SessionModule } from '../session/session.module';
import { SessionRepository } from '../session/session.repository';
import { Session, SessionSchema } from '../session/session.schema';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { User, UserSchema } from '../users/users.schema';
import { MailModule } from '../send-mail/mail.module';
import { AuthController } from './auth.controller';

@Module({
  controllers: [AuthController],
  imports: [
    UsersModule,
    SessionModule,
    ConfigModule,
    PassportModule.register({ defaultStrategy: undefined }),
    JwtModule.register({
      secret: config.jwt.secret,
      signOptions: { expiresIn: config.jwt.expiresIn },
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Session.name, schema: SessionSchema },
    ]),
    MailModule,
    RedisCacheModule,
  ],
  providers: [AuthService, JwtStrategy, LocalStrategy, SessionRepository],
})
export class AuthModule {}
