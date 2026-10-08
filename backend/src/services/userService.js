import { UserRepository } from '../repositories/userRepository.js';
import { ApiError } from '../utils/apiError.js';

export class UserService {
  static async getProfile(userId) {
    const user = await UserRepository.findById(userId);
    if (!user) throw ApiError.notFound('User profile not found');
    return user;
  }

  static async updateProfile(userId, data) {
    const updated = await UserRepository.updateProfile(userId, data);
    return updated;
  }

  static async getAllUsers(filters) {
    const users = await UserRepository.getAllUsers(filters);
    const total = await UserRepository.countUsers(filters);
    return { users, total };
  }
}
