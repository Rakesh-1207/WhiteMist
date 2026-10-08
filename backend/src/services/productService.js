import { ProductRepository } from '../repositories/productRepository.js';
import { AuditLogRepository } from '../repositories/auditLogRepository.js';
import { ApiError } from '../utils/apiError.js';

export class ProductService {
  static async getProducts(filters) {
    const products = await ProductRepository.findAll(filters);
    const total = await ProductRepository.countAll(filters);
    const page = parseInt(filters.page || 1, 10);
    const limit = parseInt(filters.limit || 12, 10);
    const totalPages = Math.ceil(total / limit);

    return {
      products,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  static async getProductBySlugOrId(identifier) {
    let product = null;
    if (!isNaN(identifier)) {
      product = await ProductRepository.findById(identifier);
    } else {
      product = await ProductRepository.findBySlug(identifier);
    }

    if (!product) {
      throw ApiError.notFound('Dishwasher product not found');
    }
    return product;
  }

  static async createProduct(productData, adminUser) {
    const newProduct = await ProductRepository.create(productData);

    await AuditLogRepository.log({
      user_id: adminUser?.id,
      user_email: adminUser?.email,
      user_role: adminUser?.role,
      action: 'PRODUCT_CREATED',
      entity: 'PRODUCT',
      entity_id: newProduct.id,
      metadata: { sku: newProduct.sku, name: newProduct.name, price: newProduct.price },
    });

    return newProduct;
  }

  static async updateProduct(id, productData, adminUser) {
    const existing = await ProductRepository.findById(id);
    if (!existing) throw ApiError.notFound('Product not found');

    const updated = await ProductRepository.update(id, productData);

    await AuditLogRepository.log({
      user_id: adminUser?.id,
      user_email: adminUser?.email,
      user_role: adminUser?.role,
      action: 'PRODUCT_UPDATED',
      entity: 'PRODUCT',
      entity_id: id,
      metadata: { previousPrice: existing.price, newPrice: updated.price },
    });

    return updated;
  }

  static async deleteProduct(id, adminUser) {
    const existing = await ProductRepository.findById(id);
    if (!existing) throw ApiError.notFound('Product not found');

    await ProductRepository.softDelete(id);

    await AuditLogRepository.log({
      user_id: adminUser?.id,
      user_email: adminUser?.email,
      user_role: adminUser?.role,
      action: 'PRODUCT_DELETED',
      entity: 'PRODUCT',
      entity_id: id,
    });

    return true;
  }
}
