import { CreateProductDto } from '../../modules/products/dto/product.request.dto';
import { ProductDocument } from '../../modules/products/products.schema';

export const transformSegment = (
  segment: any,
  category: any,
  subCategory: any,
) => {
  return {
    id: segment._id.toString(),
    name: segment.name,
    slug: segment.slug,
    categories: {
      id: category._id.toString(),
      name: category.name,
      cateSlug: category.cateSlug,
      subcategories: {
        id: subCategory._id.toString(),
        name: subCategory.name,
        subCateSlug: subCategory.subCateSlug,
      },
    },
  };
};

export const prepareProductToCreate = (
  dto: CreateProductDto,
  segment: any,
  category: any,
  subCategory: any,
) => {
  let totalQuantity = 0;
  let totalSoldQuantity = 0;

  // Kiểm tra variants
  if (dto.variants?.length) {
    dto.variants.forEach((variant) => {
      if (variant.sizes?.length) {
        variant.sizes.forEach((size) => {
          size.soldQuantity = 0; // Mặc định chưa bán
          size.inventory = size.quantity; // Ban đầu, inventory = quantity

          totalQuantity += size.quantity;
          totalSoldQuantity += size.soldQuantity;
        });
      }
    });
  }
  // Tính totalInventory
  const totalInventory = totalQuantity - totalSoldQuantity;

  return {
    ...dto,
    totalQuantity,
    totalSoldQuantity,
    totalInventory,
    segment: transformSegment(segment, category, subCategory),
  };
};

export function calculateProductInventory(product: any) {
  const totalQuantity = product.variants.reduce(
    (sum: number, variant: any) =>
      sum +
      variant.sizes.reduce(
        (sizeSum: number, size: any) => sizeSum + size.quantity,
        0,
      ),
    0,
  );

  const totalSoldQuantity = product.variants.reduce(
    (sum: number, variant: any) =>
      sum +
      variant.sizes.reduce(
        (sizeSum: number, size: any) => sizeSum + size.soldQuantity,
        0,
      ),
    0,
  );

  const totalInventory = totalQuantity - totalSoldQuantity;

  return { totalQuantity, totalSoldQuantity, totalInventory };
}
export function transformProductData(product: ProductDocument) {
  const productData = product.toObject();
  return {
    ...productData,
    variants: productData.variants
      .filter((variant) => variant.isActive)
      .map((variant) => ({
        ...variant,
        sizes: variant.sizes.filter((size) => size.isActive),
      })),
  };
}
