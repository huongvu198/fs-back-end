import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RoleDocument = HydratedDocument<Role>;

@Schema({
  collection: 'auth-roles',
  timestamps: true,
})
export class Role {
  @Prop({ length: 50, trim: true, type: String, unique: true })
  name: string;

  @Prop({
    type: String,
  })
  description?: string;
}

export class RoleInfo {
  @Prop({ type: String })
  _id: string;

  @Prop({ type: String })
  name: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
