import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude } from 'class-transformer';
import mongoose, { HydratedDocument } from 'mongoose';
import { RoleInfo } from '../../roles/roles.schema';
import { AuthProvidersEnum, VerifyCodeEnum } from '../../../shared/enum';

export type CustomerDocument = HydratedDocument<Customer>;

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

@Schema({ timestamps: false })
export class VerifyAccount {
  @Prop({ default: true })
  valid: boolean;

  @Prop({ type: String, required: true })
  code: string;

  @Prop({ type: Date, required: true })
  codeExpires: Date;

  @Prop({ type: Date, required: false })
  verifiedAt?: Date;

  @Prop({
    type: String,
    enum: Object.values(VerifyCodeEnum),
    default: VerifyCodeEnum.CREATE_ACCOUNT,
  })
  type: VerifyCodeEnum;
}

export const VerifyAccountSchema = SchemaFactory.createForClass(VerifyAccount);

@Schema({ collection: 'auth-customers', timestamps: true })
export class Customer {
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

  @Prop({ type: [AddressSchema], default: [] })
  addresses: Address[];

  @Prop({ type: Boolean, default: false })
  isActivate: boolean;

  @Prop({ type: Boolean, default: false })
  isVerify: boolean;

  @Prop({ type: [VerifyAccountSchema], default: [], _id: false })
  verifyAccount: VerifyAccount[];
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
