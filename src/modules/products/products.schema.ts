import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

class SubCategory {
  @Prop({ type: String })
  id: string;

  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  subCateSlug: string;
}

class Category {
  @Prop({ type: String })
  id: string;

  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  cateSlug: string;

  @Prop({ type: SubCategory })
  subcategories: SubCategory;
}

class Segment {
  @Prop({ type: String })
  id: string;

  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  slug: string;

  @Prop({ type: Category })
  categories: Category;
}

export class Size {
  @Prop({ required: true })
  size: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: false, default: 0 })
  soldQuantity: number;

  @Prop({ required: false, default: 0 })
  inventory: number;

  @Prop({ type: Boolean, default: false })
  isActive: boolean;
}
export type SizeDocument = HydratedDocument<Size>;
export const SizeSchema = SchemaFactory.createForClass(Size);

export class Variant {
  @Prop({ required: true })
  color: string;

  @Prop({ type: Boolean, default: false })
  isActive: boolean;

  @Prop({ required: true })
  image: string;

  @Prop({ type: [SizeSchema], default: [] })
  sizes: Size[];
}

export type VariantDocument = HydratedDocument<Variant>;
export const VariantSchema = SchemaFactory.createForClass(Variant);

export type ProductDocument = HydratedDocument<Product>;
@Schema({
  collection: 'products',
  timestamps: true,
})
export class Product {
  @Prop({ required: true, trim: true, type: String })
  name: string;

  @Prop({ required: true, type: Number })
  price: number;

  @Prop({ required: false, type: String })
  description: string;

  @Prop({ type: Boolean, default: false })
  isActive: boolean;

  @Prop({ type: Boolean, default: false })
  isArchived: boolean;

  @Prop({ type: Segment })
  segment: Segment;

  @Prop({ type: Number, default: 0 })
  discount: number;

  @Prop({ type: Number, default: 0 })
  totalQuantity: number;

  @Prop({ type: Number, default: 0 })
  totalSoldQuantity: number;

  @Prop({ type: Number, default: 0 })
  totalInventory: number;

  @Prop({ type: [VariantSchema], default: [] })
  variants: Variant[];
}

export const ProducSchema = SchemaFactory.createForClass(Product);
