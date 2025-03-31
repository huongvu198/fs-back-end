import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MasterDataDocument = HydratedDocument<MasterData>;

@Schema({ collection: 'masters-data', timestamps: true })
export class MasterData {
  @Prop({ required: true, type: String })
  type: { type: string; index: true };

  @Prop({ required: true, type: Object })
  data: any;
}

export const MasterDataSchema = SchemaFactory.createForClass(MasterData);
