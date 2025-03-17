import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { User } from '../users/users.schema';

export type SessionDocument = HydratedDocument<Session>;

@Schema({ collection: 'auth-session', timestamps: true })
export class Session {
  @Prop({
    ref: User.name,
    type: SchemaTypes.Mixed,
  })
  user: User;

  @Prop()
  hash: string;

  @Prop({ required: false, type: String })
  accessTokenAuth0: string;

  @Prop({ required: false, type: String })
  idTokenAuth0: string;

  @Prop({ required: false, type: String })
  userAuth0Id: string;
}

export const SessionSchema = SchemaFactory.createForClass(Session);

SessionSchema.index({ user: 1 });
