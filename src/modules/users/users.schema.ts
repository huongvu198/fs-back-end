import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude } from 'class-transformer';
import mongoose, { HydratedDocument } from 'mongoose';
import { RoleInfo } from '../roles/roles.schema';
import { AuthProvidersEnum } from '../../shared/enum';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: false })
export class Address {
  @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
  _id: mongoose.Types.ObjectId;

  @Prop({ required: true, trim: true })
  street: string;

  @Prop({ required: true, trim: true })
  ward: string;

  @Prop({ required: true, trim: true })
  district: string;

  @Prop({ required: true, trim: true })
  city: string;

  @Prop({ required: true, trim: true })
  country: string;

  @Prop({ default: false })
  isDefault: boolean;
}

export const AddressSchema = SchemaFactory.createForClass(Address);

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

  @Prop({ type: [AddressSchema], default: [] })
  addresses: Address[];
}

export const UserSchema = SchemaFactory.createForClass(User);
