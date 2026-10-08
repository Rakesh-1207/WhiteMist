import { checkHealth } from '../database/db.js';
import { env } from '../config/env.js';

export class HealthController {
  static async getHealth(req, res) {
    const dbStatus = await checkHealth();

    const healthInfo = {
      status: dbStatus.connected ? 'OK' : 'DEGRADED',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      service: env.APP_NAME,
      environment: env.NODE_ENV,
      database: dbStatus,
      system: {
        nodeVersion: process.version,
        memoryUsage: process.memoryUsage(),
      }
    };

    const statusCode = dbStatus.connected ? 200 : 503;
    return res.status(statusCode).json(healthInfo);
  }
}
