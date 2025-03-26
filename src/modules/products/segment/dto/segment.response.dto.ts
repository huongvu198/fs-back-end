export class SubcategoryDto {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;

  constructor(subcategory: any) {
    if (!subcategory) return;
    this.id = subcategory._id?.toString() || '';
    this.name = subcategory.name || '';
    this.slug = subcategory.slug || '';
    this.isActive = subcategory.isActive ?? true;
  }
}

export class CategoryDto {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  subcategories: SubcategoryDto[];

  constructor(category: any) {
    if (!category) return;
    this.id = category._id?.toString() || '';
    this.name = category.name || '';
    this.slug = category.slug || '';
    this.isActive = category.isActive ?? true;
    this.subcategories = Array.isArray(category.subcategories)
      ? category.subcategories.map((sub: any) => new SubcategoryDto(sub))
      : [];
  }
}

export class SegmentDto {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  categories: CategoryDto[];

  constructor(segment: any) {
    if (!segment) return;
    this.id = segment._id?.toString() || '';
    this.name = segment.name || '';
    this.slug = segment.slug || '';
    this.isActive = segment.isActive ?? true;
    this.categories = Array.isArray(segment.categories)
      ? segment.categories.map((cat: any) => new CategoryDto(cat))
      : [];
  }
}
