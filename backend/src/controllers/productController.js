import { ProductService } from '../services/productService.js';
import { ApiResponse } from '../utils/apiResponse.js';

export class ProductController {
  static async getProducts(req, res, next) {
    try {
      const result = await ProductService.getProducts(req.query);
      return ApiResponse.success(res, 'Dishwasher products retrieved successfully', result.products, 200, result.pagination);
    } catch (error) {
      next(error);
    }
  }

  static async getProductBySlugOrId(req, res, next) {
    try {
      const product = await ProductService.getProductBySlugOrId(req.params.idOrSlug);
      return ApiResponse.success(res, 'Dishwasher product details retrieved', { product });
    } catch (error) {
      next(error);
    }
  }

  static async createProduct(req, res, next) {
    try {
      const product = await ProductService.createProduct(req.body, req.user);
      return ApiResponse.created(res, 'Dishwasher product created successfully', { product });
    } catch (error) {
      next(error);
    }
  }

  static async updateProduct(req, res, next) {
    try {
      const product = await ProductService.updateProduct(req.params.id, req.body, req.user);
      return ApiResponse.success(res, 'Product updated successfully', { product });
    } catch (error) {
      next(error);
    }
  }

  static async deleteProduct(req, res, next) {
    try {
      await ProductService.deleteProduct(req.params.id, req.user);
      return ApiResponse.success(res, 'Product deactivated/deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}
