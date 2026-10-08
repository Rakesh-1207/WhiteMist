import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import { query, mockDb } from './db.js';
import logger from '../utils/logger.js';
import { runMigrations } from './migrate.js';

export const seedDatabase = async () => {
  logger.info('Starting MySQL database seeding process...');

  try {
    await runMigrations();

    // 1. Roles
    const roles = [
      { name: 'SUPER_ADMIN', description: 'Complete system control and administration' },
      { name: 'ADMIN', description: 'Store, product, and order manager' },
      { name: 'SALES_STAFF', description: 'Sales, quote, and enquiry specialist' },
      { name: 'SERVICE_STAFF', description: 'Service technician and warranty engineer' },
      { name: 'CUSTOMER', description: 'Registered store customer' },
    ];

    for (const r of roles) {
      await query(
        `INSERT INTO roles (name, description) VALUES (?, ?) ON DUPLICATE KEY UPDATE description=VALUES(description)`,
        [r.name, r.description]
      );
    }

    // 2. Users (Passwords: Password123!)
    const passwordHash = await bcrypt.hash('Password123!', 10);

    const usersData = [
      { role_id: 1, email: 'admin@whitemist.com', name: 'Super Admin', phone: '+91 9876543210' },
      { role_id: 2, email: 'storemanager@whitemist.com', name: 'Rakesh Sharma (Store Mgr)', phone: '+91 9876543211' },
      { role_id: 3, email: 'sales@whitemist.com', name: 'Ananya Gupta (Sales)', phone: '+91 9876543212' },
      { role_id: 4, email: 'service@whitemist.com', name: 'Vikram Singh (Support Lead)', phone: '+91 9876543213' },
      { role_id: 5, email: 'customer@example.com', name: 'Rahul Verma', phone: '+91 9988776655' },
    ];

    for (const u of usersData) {
      await query(
        `INSERT INTO users (role_id, email, password_hash, full_name, phone, is_verified, status)
         VALUES (?, ?, ?, ?, ?, TRUE, 'ACTIVE')
         ON DUPLICATE KEY UPDATE full_name=VALUES(full_name)`,
        [u.role_id, u.email, passwordHash, u.name, u.phone]
      );
    }

    // 3. Product Categories (Liquid Detergent Categories)
    const categories = [
      { slug: 'bottles', name: 'Ergonomic Bottles (2L)', desc: '2L Ergonomic Handle Bottles for easy pour liquid detergent.', icon: 'Droplets', order: 1 },
      { slug: 'pouches', name: 'Eco Spout Refill Pouches', desc: 'Environment friendly 2kg eco spout refill pouches.', icon: 'Package', order: 2 },
      { slug: 'funwash', name: 'Fun Wash™ Value Range', desc: 'Fun Wash 2kg high quality liquid detergent offer packs.', icon: 'Zap', order: 3 },
      { slug: 'combos', name: 'Super Saver Combos', desc: 'Mega value twin bottle & pouch combo packs.', icon: 'Layers', order: 4 },
    ];

    for (const c of categories) {
      await query(
        `INSERT INTO product_categories (slug, name, description, icon, display_order)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE name=VALUES(name), description=VALUES(description)`,
        [c.slug, c.name, c.desc, c.icon, c.order]
      );
    }

    // 4. Products (Liquid Laundry Detergents)
    const productsList = [
      {
        sku: 'WM-LD-2L-BLU',
        model_number: 'WM-OF2000',
        name: 'White Mist Ocean Fresh Liquid Detergent',
        slug: 'wm-blue-ocean',
        category_id: 1,
        tagline: 'Deep Bio-Clean & 48-Hour Sea Breeze Scent Lock',
        short_description: 'Premium bio-enzyme liquid laundry detergent engineered for both Front Load and Top Load washing machines.',
        description: 'White Mist Ocean Fresh Liquid Detergent removes 10x tough mud, oil, and sweat stains while locking in a fresh sea-breeze fragrance for 48 hours. Compatible with both Front Load & Top Load washing machines.',
        price: 499.00,
        discount_price: 349.00,
        badge: 'Bestseller',
        capacity: 2,
        dimensions: '2L Bottle / 2kg',
        energy_rating: 'Front & Top Load',
        water_consumption: 0,
        noise_level: 0,
        wash_programs_count: 40,
        warranty_years: 2,
        stock_status: 'IN_STOCK',
        available_quantity: 150,
        images: [
          '/assets/images/bottle_blue.png',
          '/assets/images/pouch_blue.png'
        ],
        specs: [
          { spec_key: 'Net Quantity', spec_value: '2 Litres / 2 Kg' },
          { spec_key: 'Machine Compatibility', spec_value: 'Front & Top Loading Washing Machines' },
          { spec_key: 'Fragrance Profile', spec_value: 'Ocean Breeze Freshness' },
          { spec_key: 'Doses Per Pack', spec_value: '40 Full Load Washes' }
        ],
        features: [
          '10x Bio-Enzyme Stain Dissolving Action',
          'Front Load & Top Load Machine Safe',
          '48-Hour Micro-Capsule Fragrance Lock',
          'Color Guard Tech Prevents Fading'
        ]
      },
      {
        sku: 'WM-LD-2L-PNK',
        model_number: 'WM-FB2000',
        name: 'White Mist Floral Bloom Liquid Detergent',
        slug: 'wm-pink-floral',
        category_id: 1,
        tagline: 'Rose Elegance Scent & Luxurious Fabric Touch',
        short_description: 'Enriched with natural floral essential oils and fabric conditioners.',
        description: 'White Mist Floral Bloom Liquid Detergent keeps whites glowing white and colors vivid while leaving your clothes velvet-soft with a captivating rose bouquet fragrance.',
        price: 499.00,
        discount_price: 349.00,
        badge: 'Top Rated',
        capacity: 2,
        dimensions: '2L Bottle / 2kg',
        energy_rating: 'Front & Top Load',
        water_consumption: 0,
        noise_level: 0,
        wash_programs_count: 40,
        warranty_years: 2,
        stock_status: 'IN_STOCK',
        available_quantity: 120,
        images: [
          '/assets/images/bottle_pink.png',
          '/assets/images/pouch_pink.png'
        ],
        specs: [
          { spec_key: 'Net Quantity', spec_value: '2 Litres / 2 Kg' },
          { spec_key: 'Machine Compatibility', spec_value: 'Front & Top Loading Washing Machines' },
          { spec_key: 'Fragrance Profile', spec_value: 'Pink Floral Bouquet' },
          { spec_key: 'Doses Per Pack', spec_value: '40 Full Load Washes' }
        ],
        features: [
          'Infused with Rose & Floral Extracts',
          'Built-in Fabric Softening & Protection',
          'Phosphate-Free & Skin Gentle',
          'Dissolves 100% in Cold Water'
        ]
      },
      {
        sku: 'FW-LD-2KG-SPOUT',
        model_number: 'FW-SP2000',
        name: 'Fun Wash™ Liquid Detergent 2kg Spout Pouch',
        slug: 'funwash-liquid-2kg',
        category_id: 3,
        tagline: 'High Quality Laundry Detergent • Special ₹99 Offer Pack',
        short_description: 'Mega Value 2kg Spout Refill Pouch by Fun Wash™. Designed for daily laundry at just ₹99!',
        description: 'Fun Wash™ 2kg Spout Refill Pouch is designed for daily family laundry, removing tough dirt effortlessly while staying ultra-gentle on your pocket at just ₹99!',
        price: 199.00,
        discount_price: 99.00,
        badge: '₹99 Special Offer',
        capacity: 2,
        dimensions: '2kg Spout Pouch',
        energy_rating: 'Front & Top Load',
        water_consumption: 0,
        noise_level: 0,
        wash_programs_count: 40,
        warranty_years: 1,
        stock_status: 'IN_STOCK',
        available_quantity: 500,
        images: [
          '/assets/images/pouch_yellow_lifestyle.jpg'
        ],
        specs: [
          { spec_key: 'Net Quantity', spec_value: '2 Kg Spout Pouch' },
          { spec_key: 'Offer Price', spec_value: '₹99 Special Launch Price' },
          { spec_key: 'Machine Compatibility', spec_value: 'Front & Top Loading Machines' }
        ],
        features: [
          'Super Saver Offer Pack at ₹99 Only!',
          'Easy Pour Spout with Screw Cap Leak Protection',
          'Works in All Front & Top Load Washing Machines',
          'Softens Fabric and Leaves Fresh Fragrance'
        ]
      }
    ];

    for (const p of productsList) {
      const pRes = await query(
        `INSERT INTO products (sku, model_number, name, slug, category_id, tagline, short_description, description, price, discount_price, badge, capacity, dimensions, energy_rating, water_consumption, noise_level, wash_programs_count, warranty_years, stock_status, available_quantity)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE name=VALUES(name), discount_price=VALUES(discount_price), available_quantity=VALUES(available_quantity)`,
        [
          p.sku, p.model_number, p.name, p.slug, p.category_id, p.tagline,
          p.short_description, p.description, p.price, p.discount_price, p.badge,
          p.capacity, p.dimensions, p.energy_rating, p.water_consumption,
          p.noise_level, p.wash_programs_count, p.warranty_years, p.stock_status, p.available_quantity
        ]
      );

      const productId = pRes.insertId || 1;

      // Product Images
      if (p.images && p.images.length > 0) {
        let isPrimary = true;
        for (const imgUrl of p.images) {
          await query(
            `INSERT INTO product_images (product_id, image_url, is_primary) VALUES (?, ?, ?)
             ON DUPLICATE KEY UPDATE is_primary=VALUES(is_primary)`,
            [productId, imgUrl, isPrimary]
          );
          isPrimary = false;
        }
      }

      // Specifications
      for (const s of p.specs) {
        await query(
          `INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES (?, ?, ?)
           ON DUPLICATE KEY UPDATE spec_value=VALUES(spec_value)`,
          [productId, s.spec_key, s.spec_value]
        );
      }

      // Features
      for (const feat of p.features) {
        await query(
          `INSERT INTO product_features (product_id, feature_text) VALUES (?, ?)
           ON DUPLICATE KEY UPDATE feature_text=VALUES(feature_text)`,
          [productId, feat]
        );
      }
    }

    logger.info('MySQL Database seeding completed successfully! Liquid detergents, categories, users, and offers are fully populated.');
  } catch (error) {
    logger.error('Failed to seed MySQL database:', error);
    throw error;
  }
};

// Auto-run if executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
