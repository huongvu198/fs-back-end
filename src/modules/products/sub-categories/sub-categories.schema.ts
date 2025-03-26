import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ProductSubcategoryDocument = HydratedDocument<ProductSubcategory>;

@Schema({
  collection: 'product-subcategories',
  timestamps: true,
})
export class ProductSubcategory {
  @Prop({ required: true, trim: true, type: String })
  name: string;

  @Prop({ required: true, trim: true, type: String })
  subCateSlug: string;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;
}

export const ProductSubcategorySchema =
  SchemaFactory.createForClass(ProductSubcategory);
