import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import {
  ProductSubcategory,
  ProductSubcategorySchema,
} from '../sub-categories/sub-categories.schema';

export type ProductCategoryDocument = HydratedDocument<ProductCategory>;

@Schema({
  collection: 'product-categories',
  timestamps: true,
})
export class ProductCategory {
  @Prop({ required: true, trim: true, type: String })
  name: string;

  @Prop({ required: true, trim: true, type: String })
  cateSlug: string;

  @Prop({ type: [ProductSubcategorySchema] })
  subcategories?: ProductSubcategory[];

  @Prop({ type: Boolean, default: true })
  isActive: boolean;

  @Prop({ type: String })
  segmentId: string;
}

export const ProductCategorySchema =
  SchemaFactory.createForClass(ProductCategory);
