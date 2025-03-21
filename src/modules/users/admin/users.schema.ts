import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude } from 'class-transformer';
import { HydratedDocument } from 'mongoose';
import { RoleInfo } from '../../roles/roles.schema';
import { AuthProvidersEnum } from '../../../shared/enum';

export type UserDocument = HydratedDocument<User>;

@Schema({ collection: 'auth-users', timestamps: true })
export class User {
  @Prop({
    type: String,
  })
  name: string;

  @Prop({
    required: true,
    trim: true,
    type: String,
    unique: true,
  })
  email: string;

  @Prop({
    required: true,
    trim: true,
    type: String,
  })
  phoneNumber: string;

  @Exclude({ toPlainOnly: true })
  @Prop({ required: true, type: String })
  password: string;

  @Exclude({ toPlainOnly: true })
  @Prop({ type: String })
  previousPassword?: string;

  @Prop({
    default: AuthProvidersEnum.EMAIL,
    enum: AuthProvidersEnum,
  })
  provider: string;

  @Prop({
    required: true,
    type: RoleInfo,
  })
  role: RoleInfo;
}

export const UserSchema = SchemaFactory.createForClass(User);
