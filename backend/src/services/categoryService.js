import { CategoryRepository } from '../repositories/categoryRepository.js';
import { ApiError } from '../utils/apiError.js';

export class CategoryService {
  static async getCategories() {
    return CategoryRepository.findAll();
  }

  static async getCategoryBySlug(slug) {
    const category = await CategoryRepository.findBySlug(slug);
    if (!category) throw ApiError.notFound('Category not found');
    return category;
  }

  static async createCategory(data) {
    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return CategoryRepository.create({ ...data, slug });
  }

  static async updateCategory(id, data) {
    const existing = await CategoryRepository.findById(id);
    if (!existing) throw ApiError.notFound('Category not found');
    return CategoryRepository.update(id, data);
  }

  static async deleteCategory(id) {
    const existing = await CategoryRepository.findById(id);
    if (!existing) throw ApiError.notFound('Category not found');
    return CategoryRepository.delete(id);
  }
}
