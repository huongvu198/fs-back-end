export interface ISize {
  _id: string;
  size: string;
  quantity: number;
  soldQuantity: number;
  inventory: number;
  isActive: boolean;
}

export interface IVariant {
  _id: string;
  color: string;
  isActive: boolean;
  image: string;
  sizes: ISize[];
}

export interface ISubCategory {
  _id: string;
  name: string;
  subCateSlug: string;
}

export interface ICategory {
  _id: string;
  name: string;
  cateSlug: string;
  subcategories: ISubCategory;
}

export interface ISegment {
  _id: string;
  name: string;
  slug: string;
  categories: ICategory;
}

export interface IProduct {
  _id: string;
  name: string;
  price: number;
  isActive: boolean;
  segment: ISegment;
  discount: number;
  totalQuantity: number;
  totalSoldQuantity: number;
  totalInventory: number;
  variants: IVariant[];
  createdAt: string;
  updatedAt: string;
  isArchived: boolean;
}
