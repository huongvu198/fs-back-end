import { BadRequestException, Injectable } from '@nestjs/common';
import { ProductRepository } from './products.repository';
import {
  CreateProductDto,
  GetProductDto,
  UpdateProductDto,
  UpdateSaleDto,
} from './dto/product.request.dto';
import { ProductCategoryService } from './categories/categories.service';
import { ProductSegmentService } from './segment/segment.service';
import { ProductSubcategoryService } from './sub-categories/sub-categories.service';
import { Errors } from '../../errors/errors';
import {
  calculateProductInventory,
  prepareProductToCreate,
  transformProductData,
  transformSegment,
} from '../../shared/transformers/product.transformer';
import { IPagination } from '../../shared/pagination/pagination.interface';
import { PaginationHeaderHelper } from '../../shared/pagination/pagination.helper';
import { replaceQuerySearch } from '../../shared/helpers/common.helper';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly productSegmentService: ProductSegmentService,
    private readonly productCategoryService: ProductCategoryService,
    private readonly productSubcategoryService: ProductSubcategoryService,
    private readonly paginationHeaderHelper: PaginationHeaderHelper,
  ) {}

  async create(dto: CreateProductDto) {
    const category = await this.productCategoryService.findOneCategoryById(
      dto.categoryId,
    );
    if (!category) {
      throw new BadRequestException(Errors.CATEGORY_NOT_FOUND);
    }
    const subCategory =
      await this.productSubcategoryService.findOneSubCategoryById(
        dto.subCategoryId,
      );
    if (!subCategory) {
      throw new BadRequestException(Errors.SUBCATEGORY_NOT_FOUND);
    }
    const segment = await this.productSegmentService.findSegmentByCategoryId(
      category._id,
    );
    if (!segment) {
      throw new BadRequestException(Errors.SEGMENT_NOT_FOUND);
    }

    const payload = prepareProductToCreate(dto, segment, category, subCategory);

    return await this.productRepository.create(payload);
  }

  async archive(id: string) {
    const product = await this.productRepository.findById(id);
    if (!product) throw new Error('Product not found');

    // Cập nhật tất cả variants và sizes về isActive = false
    const updatedVariants = product.variants.map((variant: any) => ({
      ...variant,
      isActive: false,
      sizes: variant.sizes.map((size: any) => ({
        ...size,
        isActive: false,
      })),
    }));

    // Cập nhật sản phẩm
    await this.productRepository.updateById(id, {
      isArchived: true,
      isActive: false,
      variants: updatedVariants,
    });

    return await this.productRepository.findById(id);
  }

  async findNewArrivals(pagination: IPagination) {
    return this.findProducts(pagination, 'createdAt', -1);
  }

  async findBestSellers(pagination: IPagination) {
    return this.findProducts(pagination, 'totalSoldQuantity', -1);
  }

  async findProducts(
    pagination: IPagination,
    sortField: string,
    sortOrder: number,
  ) {
    const findParams: any = {
      isArchived: false,
      isActive: true,
    };

    const options = {
      limit: pagination.perPage,
      skip: pagination.startIndex,
      sort: { [sortField]: sortOrder },
    };

    const products = await this.productRepository.find(findParams, options);
    const total = await this.productRepository.count(findParams);

    const responseHeaders = this.paginationHeaderHelper.getHeaders(
      pagination,
      total,
    );

    return {
      headers: responseHeaders,
      items: products,
    };
  }

  async update(productId: string, dto: UpdateProductDto) {
    // Fetch the existing product
    const existingProduct = await this.productRepository.findById(productId);
    if (!existingProduct) {
      throw new BadRequestException(Errors.PRODUCT_NOT_FOUND);
    }

    let newSegment = existingProduct.segment;
    // If the segment or categories change, find the new segment
    if (
      dto.segmentId !== String(existingProduct.segment.id) ||
      dto.categoryId !== String(existingProduct.segment.categories.id) ||
      dto.subCategoryId !==
        String(existingProduct.segment.categories.subcategories.id)
    ) {
      const category = await this.productCategoryService.findOneCategoryById(
        dto.categoryId,
      );
      if (!category) {
        throw new BadRequestException(Errors.CATEGORY_NOT_FOUND);
      }

      const subCategory =
        await this.productSubcategoryService.findOneSubCategoryById(
          dto.subCategoryId,
        );
      if (!subCategory) {
        throw new BadRequestException(Errors.SUBCATEGORY_NOT_FOUND);
      }

      const segment = await this.productSegmentService.findSegmentByCategoryId(
        category._id,
      );
      if (!segment) {
        throw new BadRequestException(Errors.SEGMENT_NOT_FOUND);
      }

      newSegment = transformSegment(segment, category, subCategory);
    }

    Object.assign(existingProduct, {
      name: dto.name,
      description: dto.description,
      price: dto.price,
      isActive: dto.isActive,
      isArchived: dto.isArchived,
      segment: newSegment,
      discount: dto.discount,
    });

    if (dto.variants && dto.variants.length > 0) {
      for (const newVariant of dto.variants) {
        const existingVariant = existingProduct.variants.find(
          (v) => v.color === newVariant.color,
        );

        if (existingVariant) {
          // Cập nhật ảnh, trạng thái và danh sách size
          existingVariant.image = newVariant.image;
          existingVariant.isActive = newVariant.isActive;

          for (const newSize of newVariant.sizes) {
            const existingSize = existingVariant.sizes.find(
              (s) => s.size === newSize.size,
            );
            if (existingSize) {
              existingSize.quantity = newSize.quantity;
              existingSize.isActive = newSize.isActive;
              existingSize.inventory =
                newSize.quantity - existingSize.soldQuantity;
            } else {
              existingVariant.sizes.push({
                ...newSize,
                soldQuantity: 0,
                inventory: newSize.quantity,
              });
            }
          }
        } else {
          // Nếu variant mới, thêm vào danh sách
          existingProduct.variants.push({
            ...newVariant,
            sizes: newVariant.sizes.map((size) => ({
              ...size,
              soldQuantity: 0,
              inventory: size.quantity,
            })),
          });
        }
      }
    }

    // Cập nhật tổng số lượng tồn kho
    const { totalQuantity, totalSoldQuantity, totalInventory } =
      calculateProductInventory(existingProduct);

    existingProduct.totalQuantity = totalQuantity;
    existingProduct.totalSoldQuantity = totalSoldQuantity;
    existingProduct.totalInventory = totalInventory;

    // Lưu thay đổi vào DB
    await this.productRepository.updateById(productId, existingProduct);

    return this.productRepository.findById(existingProduct._id);
  }

  async findProductById(productId: string) {
    const product = await this.productRepository.findById(productId);

    if (!product) {
      throw new BadRequestException(Errors.PRODUCT_NOT_FOUND);
    }

    if (product.isArchived) {
      throw new BadRequestException(Errors.PRODUCT_NOT_AVAILABLE);
    }

    // return các sản phẩm active nếu cần
    // return transformProductData(product);
    return product;
  }

  async findAllProductCms(query: GetProductDto, pagination: IPagination) {
    const findParams: any = {
      ...(query?.name && {
        name: { $regex: replaceQuerySearch(query.name), $options: 'i' },
      }),
      ...(query?.isArchived !== undefined
        ? { isArchived: query.isArchived } // Nếu isArchived tồn tại, lấy đúng giá trị truyền vào
        : { isArchived: false }), // Mặc định isArchived = false nếu không truyền

      ...(query?.isActive !== undefined
        ? { isActive: query.isActive, isArchived: false } // Nếu có isActive, lọc theo giá trị và luôn isArchived = false
        : {}), // Nếu không truyền isActive, lấy cả true & false
    };

    const options = {
      limit: pagination.perPage,
      skip: pagination.startIndex,
      sort: { createdAt: -1 },
    };

    const products = await this.productRepository.find(findParams, options);
    const total = await this.productRepository.count(findParams);

    const responseHeaders = this.paginationHeaderHelper.getHeaders(
      pagination,
      total,
    );

    return {
      headers: responseHeaders,
      items: products,
    };
  }

  async findProductByIdCms(productId: string) {
    const product = await this.productRepository.findById(productId);

    if (!product) {
      throw new BadRequestException(Errors.PRODUCT_NOT_FOUND);
    }

    if (product.isArchived) {
      throw new BadRequestException(Errors.PRODUCT_NOT_AVAILABLE);
    }

    return product;
  }
}
