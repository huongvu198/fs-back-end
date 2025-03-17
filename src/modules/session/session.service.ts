import { Injectable } from '@nestjs/common';

import { CreateSessionDto } from './dto/create-session.dto';
import { ISession } from './interface/session.interface';
import { SessionRepository } from './session.repository';

@Injectable()
export class SessionService {
  constructor(private readonly sessionRepository: SessionRepository) {}

  async create(sessionDto: CreateSessionDto): Promise<ISession> {
    return await this.sessionRepository.create(sessionDto);
  }

  async getByQuery(query: any): Promise<ISession> {
    return await this.sessionRepository.findOne(query);
  }

  async deleteByUserId(userId: string): Promise<number> {
    return await this.sessionRepository.deleteMany({ user: userId });
  }

  async deleteById(id: string) {
    return await this.sessionRepository.deleteById(id);
  }

  async deleteByAuth0Id(auth0Id: string): Promise<number> {
    return await this.sessionRepository.deleteMany({ userAuth0Id: auth0Id });
  }
}
