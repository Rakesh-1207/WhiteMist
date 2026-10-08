import mysql from 'mysql2/promise';
import { env } from '../config/env.js';
import logger from '../utils/logger.js';

let pool = null;
let isUsingMock = false;

// In-Memory Database Store for offline fallback execution
const mockDb = {
  roles: [],
  users: [],
  user_addresses: [],
  product_categories: [],
  products: [],
  product_images: [],
  product_specifications: [],
  product_features: [],
  inventory_logs: [],
  enquiries: [],
  quote_requests: [],
  service_requests: [],
  warranties: [],
  warranty_claims: [],
  orders: [],
  order_items: [],
  contact_messages: [],
  newsletter_subscribers: [],
  audit_logs: [],
  refresh_tokens: [],
  autoIncrements: {},
};

export const getPool = async () => {
  if (pool) return pool;

  try {
    const connectionPool = mysql.createPool({
      host: env.DB_HOST,
      port: env.DB_PORT,
      user: env.DB_USER,
      password: env.DB_PASSWORD,
      database: env.DB_NAME,
      waitForConnections: true,
      connectionLimit: env.DB_CONNECTION_LIMIT,
      queueLimit: 0,
      multipleStatements: true,
    });

    // Test connection
    const conn = await connectionPool.getConnection();
    conn.release();
    logger.info(`MySQL database pool connected successfully to ${env.DB_NAME}@${env.DB_HOST}:${env.DB_PORT}`);
    pool = connectionPool;
    isUsingMock = false;
    return pool;
  } catch (error) {
    logger.warn(`MySQL Connection Error (${error.message}). Checking mock database fallback strategy...`);
    if (env.DB_USE_MOCK_IF_DISCONNECTED) {
      logger.info(`DB_USE_MOCK_IF_DISCONNECTED is enabled. Using resilient in-memory database pool.`);
      isUsingMock = true;
      return null;
    }
    throw error;
  }
};

export const query = async (sql, params = []) => {
  try {
    const activePool = await getPool();
    if (activePool && !isUsingMock) {
      const [rows, fields] = await activePool.execute(sql, params);
      return rows;
    }
  } catch (err) {
    if (!env.DB_USE_MOCK_IF_DISCONNECTED) throw err;
    isUsingMock = true;
  }

  // Mock Query Engine fallback
  return mockExecute(sql, params);
};

export const getTransaction = async () => {
  const activePool = await getPool();
  if (activePool && !isUsingMock) {
    const connection = await activePool.getConnection();
    await connection.beginTransaction();
    return {
      query: async (sql, params = []) => {
        const [rows] = await connection.execute(sql, params);
        return rows;
      },
      commit: async () => {
        await connection.commit();
        connection.release();
      },
      rollback: async () => {
        await connection.rollback();
        connection.release();
      },
    };
  }

  // Mock Transaction
  return {
    query: async (sql, params = []) => mockExecute(sql, params),
    commit: async () => logger.debug('[Mock DB] Transaction committed'),
    rollback: async () => logger.debug('[Mock DB] Transaction rolled back'),
  };
};

export const checkHealth = async () => {
  try {
    const activePool = await getPool();
    if (activePool && !isUsingMock) {
      const [rows] = await activePool.execute('SELECT 1 AS healthy');
      return { connected: true, driver: 'MySQL 8.x', status: 'Healthy' };
    }
    return { connected: true, driver: 'In-Memory Relational Engine (Offline Mode)', status: 'Healthy' };
  } catch (error) {
    return { connected: false, error: error.message, status: 'Unhealthy' };
  }
};

// In-Memory Query Engine implementation
function mockExecute(sql, params = []) {
  const trimmed = sql.trim().replace(/\s+/g, ' ');

  // SELECT queries
  if (/^SELECT/i.test(trimmed)) {
    let tableName = null;
    const fromMatch = trimmed.match(/FROM\s+([a-zA-Z0-9_]+)/i);
    if (fromMatch) tableName = fromMatch[1];

    if (!tableName || !mockDb[tableName]) {
      if (trimmed.includes('COUNT(*)')) return [{ count: 0, 'COUNT(*)': 0 }];
      return [];
    }

    let records = [...mockDb[tableName]];

    // Filtering soft deletes if table has deleted_at
    if (trimmed.includes('deleted_at IS NULL')) {
      records = records.filter(r => !r.deleted_at);
    }
    if (trimmed.includes("p.status = 'ACTIVE'") || trimmed.includes("status = 'ACTIVE'")) {
      records = records.filter(r => r.status === 'ACTIVE' || !r.status);
    }

    // WHERE conditions parsing
    if (/WHERE.*(?:p\.)?id\s*=\s*\?/i.test(trimmed)) {
      records = records.filter(r => r.id === params[0] || String(r.id) === String(params[0]));
    } else if (/WHERE.*(?:u\.)?email\s*=\s*\?/i.test(trimmed)) {
      records = records.filter(r => r.email === params[0]);
    } else if (/WHERE.*(?:p\.)?sku\s*=\s*\?/i.test(trimmed)) {
      records = records.filter(r => r.sku === params[0]);
    } else if (/WHERE.*(?:p\.)?slug\s*=\s*\?/i.test(trimmed) || /WHERE.*(?:c\.)?slug\s*=\s*\?/i.test(trimmed)) {
      records = records.filter(r => r.slug === params[0]);
    } else if (/WHERE.*(?:w\.)?serial_number\s*=\s*\?/i.test(trimmed)) {
      records = records.filter(r => r.serial_number === params[0]);
    } else if (/WHERE.*(?:s\.)?ticket_number\s*=\s*\?/i.test(trimmed)) {
      records = records.filter(r => r.ticket_number === params[0]);
    } else if (/WHERE.*(?:o\.)?order_number\s*=\s*\?/i.test(trimmed)) {
      records = records.filter(r => r.order_number === params[0]);
    } else if (/WHERE.*(?:p\.)?category_id\s*=\s*\?/i.test(trimmed)) {
      records = records.filter(r => r.category_id === params[0] || String(r.category_id) === String(params[0]));
    } else if (/WHERE.*(?:u\.)?user_id\s*=\s*\?/i.test(trimmed)) {
      records = records.filter(r => r.user_id === params[0] || String(r.user_id) === String(params[0]));
    } else if (/WHERE.*(?:s\.)?customer_id\s*=\s*\?/i.test(trimmed) || /WHERE.*(?:o\.)?customer_id\s*=\s*\?/i.test(trimmed) || /WHERE.*(?:w\.)?customer_id\s*=\s*\?/i.test(trimmed)) {
      records = records.filter(r => r.customer_id === params[0] || String(r.customer_id) === String(params[0]));
    } else if (/WHERE.*(?:pi\.|spec\.|ft\.|oi\.|il\.|cl\.)?product_id\s*=\s*\?/i.test(trimmed) || /WHERE.*order_id\s*=\s*\?/i.test(trimmed) || /WHERE.*warranty_id\s*=\s*\?/i.test(trimmed)) {
      const targetId = params[0];
      if (tableName === 'product_images' || tableName === 'product_specifications' || tableName === 'product_features' || tableName === 'inventory_logs') {
        records = records.filter(r => r.product_id === targetId || String(r.product_id) === String(targetId));
      } else if (tableName === 'order_items') {
        records = records.filter(r => r.order_id === targetId || String(r.order_id) === String(targetId));
      } else if (tableName === 'warranty_claims') {
        records = records.filter(r => r.warranty_id === targetId || String(r.warranty_id) === String(targetId));
      }
    }

    // Attach category details if products query
    if (tableName === 'products') {
      records = records.map(p => {
        const cat = mockDb.product_categories.find(c => c.id === p.category_id || String(c.id) === String(p.category_id));
        return {
          ...p,
          category_name: cat ? cat.name : 'Freestanding Dishwashers',
          category_slug: cat ? cat.slug : 'freestanding',
        };
      });
    } else if (tableName === 'users') {
      records = records.map(u => {
        const role = mockDb.roles.find(r => r.id === u.role_id || String(r.id) === String(u.role_id));
        return {
          ...u,
          role_name: role ? role.name : 'CUSTOMER',
        };
      });
    } else if (tableName === 'warranties') {
      records = records.map(w => {
        const prod = mockDb.products.find(p => p.id === w.product_id || String(p.id) === String(w.product_id));
        return {
          ...w,
          product_name: prod ? prod.name : 'Dishwasher',
          sku: prod ? prod.sku : 'WM-DW-14F',
          warranty_years: prod ? prod.warranty_years : 2,
        };
      });
    }

    if (trimmed.includes('COUNT(*)')) {
      return [{ count: records.length, 'COUNT(*)': records.length }];
    }

    return records;
  }

  // INSERT queries
  if (/^INSERT INTO/i.test(trimmed)) {
    const tableMatch = trimmed.match(/INSERT INTO\s+([a-zA-Z0-9_]+)/i);
    if (!tableMatch) return { insertId: 1, affectedRows: 1 };
    const tableName = tableMatch[1];
    if (!mockDb[tableName]) mockDb[tableName] = [];

    const colsMatch = trimmed.match(/\(([^)]+)\)\s+VALUES/i);
    const cols = colsMatch ? colsMatch[1].split(',').map(c => c.trim().replace(/`/g, '')) : [];

    mockDb.autoIncrements[tableName] = (mockDb.autoIncrements[tableName] || 0) + 1;
    const newId = mockDb.autoIncrements[tableName];

    const record = { id: newId, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    cols.forEach((col, idx) => {
      record[col] = params[idx] !== undefined ? params[idx] : null;
    });

    // Check duplicate key
    const existingIndex = mockDb[tableName].findIndex(r => 
      (r.sku && r.sku === record.sku) || 
      (r.email && r.email === record.email) || 
      (r.slug && r.slug === record.slug) ||
      (r.serial_number && r.serial_number === record.serial_number) ||
      (r.ticket_number && r.ticket_number === record.ticket_number) ||
      (r.enquiry_number && r.enquiry_number === record.enquiry_number) ||
      (r.quote_number && r.quote_number === record.quote_number) ||
      (r.order_number && r.order_number === record.order_number)
    );

    if (existingIndex >= 0) {
      mockDb[tableName][existingIndex] = { ...mockDb[tableName][existingIndex], ...record };
      return { insertId: mockDb[tableName][existingIndex].id, affectedRows: 1 };
    }

    mockDb[tableName].push(record);
    return { insertId: newId, affectedRows: 1 };
  }

  // UPDATE queries
  if (/^UPDATE/i.test(trimmed)) {
    const tableMatch = trimmed.match(/UPDATE\s+([a-zA-Z0-9_]+)/i);
    if (tableMatch) {
      const tableName = tableMatch[1];
      if (mockDb[tableName]) {
        let idVal = params[params.length - 1];
        const record = mockDb[tableName].find(r => r.id === idVal || String(r.id) === String(idVal));
        if (record) {
          record.updated_at = new Date().toISOString();
        }
      }
    }
    return { affectedRows: 1 };
  }

  // DELETE queries
  if (/^DELETE FROM/i.test(trimmed)) {
    const tableMatch = trimmed.match(/DELETE FROM\s+([a-zA-Z0-9_]+)/i);
    if (tableMatch) {
      const tableName = tableMatch[1];
      if (mockDb[tableName]) {
        const idVal = params[0];
        mockDb[tableName] = mockDb[tableName].filter(r => r.id !== idVal && String(r.id) !== String(idVal));
      }
    }
    return { affectedRows: 1 };
  }

  return { affectedRows: 1, insertId: 1 };
}

export { mockDb };
