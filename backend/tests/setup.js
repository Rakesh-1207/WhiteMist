import { seedDatabase } from '../src/database/seed.js';

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  await seedDatabase();
});
