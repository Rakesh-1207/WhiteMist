import bcrypt from 'bcryptjs';
import { UserRepository } from '../repositories/userRepository.js';
import { AuditLogRepository } from '../repositories/auditLogRepository.js';
import { generateTokens, verifyRefreshToken } from '../utils/jwt.js';
import { ApiError } from '../utils/apiError.js';

export class AuthService {
  static async register({ email, password, full_name, phone, role = 'CUSTOMER' }) {
    const existing = await UserRepository.findByEmail(email);
    if (existing) {
      throw ApiError.conflict('An account with this email address already exists');
    }

    const password_hash = await bcrypt.hash(password, 10);
    const role_id = await UserRepository.getRoleIdByName(role);

    const user = await UserRepository.create({
      role_id,
      email,
      password_hash,
      full_name,
      phone,
    });

    const tokens = generateTokens(user);

    await AuditLogRepository.log({
      user_id: user.id,
      user_email: user.email,
      user_role: user.role_name,
      action: 'USER_REGISTERED',
      entity: 'USER',
      entity_id: user.id,
    });

    return { user, tokens };
  }

  static async login({ email, password, ip_address }) {
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      throw ApiError.unauthorized('Invalid email or password credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      throw ApiError.unauthorized('Invalid email or password credentials');
    }

    if (user.status !== 'ACTIVE') {
      throw ApiError.forbidden('Your account is inactive or suspended. Please contact support.');
    }

    const tokens = generateTokens(user);

    await AuditLogRepository.log({
      user_id: user.id,
      user_email: user.email,
      user_role: user.role_name,
      action: 'USER_LOGIN',
      entity: 'USER',
      entity_id: user.id,
      ip_address,
    });

    delete user.password_hash;
    return { user, tokens };
  }

  static async refreshTokens(refreshToken) {
    try {
      const decoded = verifyRefreshToken(refreshToken);
      const user = await UserRepository.findById(decoded.id);
      if (!user) throw ApiError.unauthorized('User not found');
      return generateTokens(user);
    } catch (err) {
      throw ApiError.unauthorized('Invalid or expired refresh token');
    }
  }

  static async changePassword(userId, { currentPassword, newPassword }) {
    const sql = `SELECT password_hash FROM users WHERE id = ?`;
    const user = await UserRepository.findById(userId);
    if (!user) throw ApiError.notFound('User not found');

    const fullUser = await UserRepository.findByEmail(user.email);
    const isMatch = await bcrypt.compare(currentPassword, fullUser.password_hash);
    if (!isMatch) throw ApiError.badRequest('Current password is incorrect');

    const newHash = await bcrypt.hash(newPassword, 10);
    await UserRepository.updatePassword(userId, newHash);

    await AuditLogRepository.log({
      user_id: userId,
      user_email: user.email,
      user_role: user.role_name,
      action: 'PASSWORD_CHANGED',
      entity: 'USER',
      entity_id: userId,
    });

    return true;
  }
}
