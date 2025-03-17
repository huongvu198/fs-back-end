import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { SessionRepository } from './session.repository';
import { Session, SessionSchema } from './session.schema';
import { SessionService } from './session.service';

@Module({
  exports: [SessionService, SessionRepository],
  imports: [
    MongooseModule.forFeature([{ name: Session.name, schema: SessionSchema }]),
  ],
  providers: [SessionService, SessionRepository],
})
export class SessionModule {}
