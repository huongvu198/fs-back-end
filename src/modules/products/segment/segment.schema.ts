import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import {
  ProductCategory,
  ProductCategorySchema,
} from '../categories/categories.schema';

export type ProductSegmentDocument = HydratedDocument<ProductSegment>;

@Schema({
  collection: 'product-segments',
  timestamps: true,
})
export class ProductSegment {
  @Prop({ required: true, trim: true, type: String })
  name: string;

  @Prop({ required: true, trim: true, type: String })
  slug: string;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;

  @Prop({ type: [ProductCategorySchema] })
  categories?: ProductCategory[];
}

export const ProductSegmentSchema =
  SchemaFactory.createForClass(ProductSegment);
