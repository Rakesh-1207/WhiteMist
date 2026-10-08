import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { env } from './config/env.js';
import routes from './routes/index.js';
import { HealthController } from './controllers/healthController.js';
import { errorHandler } from './middleware/errorHandlerMiddleware.js';
import { apiRateLimiter } from './middleware/rateLimiterMiddleware.js';

const app = express();

// Security Middlewares
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: env.FRONTEND_URL || '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Static Uploads Folder
app.use('/uploads', express.static(path.join(process.cwd(), env.UPLOAD_DIR)));

// Rate Limiting
app.use('/api/', apiRateLimiter);

// Top Level Health Endpoint
app.get('/health', HealthController.getHealth);

// API v1 Router
app.use(env.API_PREFIX, routes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`,
    error: { code: 'NOT_FOUND' },
  });
});

// Centralized Error Handler
app.use(errorHandler);

export default app;
