import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { query, getPool, mockDb } from './db.js';
import logger from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const runMigrations = async () => {
  logger.info('Starting MySQL database migrations execution...');
  try {
    // Reset mockDb state for clean isolated test runs
    if (mockDb) {
      Object.keys(mockDb).forEach(key => {
        if (Array.isArray(mockDb[key])) mockDb[key] = [];
        else if (typeof mockDb[key] === 'object' && key === 'autoIncrements') mockDb[key] = {};
      });
    }
    const schemaPath = path.join(__dirname, 'schema.sql');
    const sqlScript = fs.readFileSync(schemaPath, 'utf-8');

    const statements = sqlScript
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);

    for (const statement of statements) {
      await query(statement);
    }

    // Ensure columns exist on products table for rich UI presentation
    try {
      const colCheck = await query(`
        SELECT COLUMN_NAME 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'products' AND COLUMN_NAME = 'color'
      `);
      if (!colCheck || colCheck.length === 0) {
        await query(`
          ALTER TABLE products 
          ADD COLUMN color VARCHAR(50) DEFAULT 'blue',
          ADD COLUMN accent_color VARCHAR(50) DEFAULT '#0084FF',
          ADD COLUMN bg_gradient VARCHAR(255) DEFAULT 'linear-gradient(135deg, #E6F3FF 0%, #FFFFFF 100%)'
        `);
        logger.info('Added UI styling columns (color, accent_color, bg_gradient) to products table.');
      }
    } catch (colErr) {
      logger.warn(`Column check notice: ${colErr.message}`);
    }

    logger.info(`Successfully executed ${statements.length} migration statements. Database schema is up to date.`);
    return true;
  } catch (error) {
    logger.error('Failed to execute database migrations:', error);
    throw error;
  }
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runMigrations()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
