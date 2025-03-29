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
