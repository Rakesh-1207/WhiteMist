import { CategoryService } from '../services/categoryService.js';
import { ApiResponse } from '../utils/apiResponse.js';

export class CategoryController {
  static async getCategories(req, res, next) {
    try {
      const categories = await CategoryService.getCategories();
      return ApiResponse.success(res, 'Categories retrieved successfully', { categories });
    } catch (error) {
      next(error);
    }
  }

  static async getCategoryBySlug(req, res, next) {
    try {
      const category = await CategoryService.getCategoryBySlug(req.params.slug);
      return ApiResponse.success(res, 'Category details retrieved', { category });
    } catch (error) {
      next(error);
    }
  }

  static async createCategory(req, res, next) {
    try {
      const category = await CategoryService.createCategory(req.body);
      return ApiResponse.created(res, 'Category created successfully', { category });
    } catch (error) {
      next(error);
    }
  }

  static async updateCategory(req, res, next) {
    try {
      const category = await CategoryService.updateCategory(req.params.id, req.body);
      return ApiResponse.success(res, 'Category updated successfully', { category });
    } catch (error) {
      next(error);
    }
  }

  static async deleteCategory(req, res, next) {
    try {
      await CategoryService.deleteCategory(req.params.id);
      return ApiResponse.success(res, 'Category deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}
