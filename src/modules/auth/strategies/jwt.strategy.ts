import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { config } from '../../../config/app.config';
import { JwtPayloadType } from './types/jwt-payload.type';
import { SessionRepository } from '../../session/session.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly sessionRepository: SessionRepository) {
    super({
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.jwt.secret,
    });
  }

  async validate(payload: JwtPayloadType): Promise<JwtPayloadType> {
    if (!payload.id || !payload.sessionId) {
      throw new UnauthorizedException();
    }

    const session = await this.sessionRepository.findById(payload.sessionId);
    if (!session) {
      throw new UnauthorizedException();
    }

    return payload;
  }
}
