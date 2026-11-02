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

    // 3. Product Categories
    const categories = [
      { slug: 'all', name: 'All Products & Refills', desc: 'Complete catalog of White Mist liquid laundry solutions', icon: 'Sparkles', order: 0 },
      { slug: 'bottles', name: 'Ergonomic Bottles (2L)', desc: '2L Ergonomic Handle Bottles for easy pour liquid detergent.', icon: 'Droplets', order: 1 },
      { slug: 'pouches', name: 'Eco Spout Refill Pouches', desc: 'Environment friendly 2kg eco spout refill pouches.', icon: 'Package', order: 2 },
      { slug: 'funwash', name: 'Fun Wash™ Value Packs', desc: 'Fun Wash 2kg high quality liquid detergent offer packs.', icon: 'Zap', order: 3 },
      { slug: 'combos', name: 'Super Saver Combos', desc: 'Mega value twin bottle & pouch combo packs.', icon: 'Layers', order: 4 },
    ];

    for (const c of categories) {
      await query(
        `INSERT INTO product_categories (slug, name, description, icon, display_order)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE name=VALUES(name), description=VALUES(description), icon=VALUES(icon), display_order=VALUES(display_order)`,
        [c.slug, c.name, c.desc, c.icon, c.order]
      );
    }

    // Fetch categories for ID mapping
    const catRows = await query('SELECT id, slug FROM product_categories');
    const catMap = {};
    catRows.forEach(r => { catMap[r.slug] = r.id; });

    // 4. Products (All 6 Liquid Detergents)
    const productsList = [
      {
        sku: 'WM-LD-2L-BLU',
        model_number: 'WM-OF2000',
        name: 'White Mist Ocean Fresh Liquid Detergent',
        slug: 'wm-blue-ocean',
        category_slug: 'bottles',
        tagline: 'Deep Bio-Clean & 48-Hour Sea Breeze Scent Lock',
        short_description: 'Premium bio-enzyme liquid laundry detergent engineered for both Front Load and Top Load washing machines.',
        description: 'White Mist Ocean Fresh Liquid Detergent removes 10x tough mud, oil, and sweat stains while locking in a fresh sea-breeze fragrance for 48 hours. Compatible with both Front Load & Top Load washing machines.',
        price: 499.00,
        discount_price: 349.00,
        badge: 'Bestseller',
        rating: 4.90,
        reviews_count: 1420,
        color: 'blue',
        accent_color: '#0084FF',
        bg_gradient: 'linear-gradient(135deg, #E6F3FF 0%, #FFFFFF 100%)',
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
          { url: '/assets/images/bottle_blue.png', isPrimary: true },
          { url: '/assets/images/pouch_blue.png', isPrimary: false }
        ],
        formats: [
          { format_code: 'bot-2l', name: '2L Ergonomic Handle Bottle', price: 349.00, mrp: 499.00, discount: '30% OFF', image: '/assets/images/bottle_blue.png', doses: 40 },
          { format_code: 'pouch-2l', name: '2kg Eco Spout Refill Pouch', price: 289.00, mrp: 399.00, discount: '27% OFF', image: '/assets/images/pouch_blue.png', doses: 40 }
        ],
        specs: [
          { spec_key: 'Net Quantity', spec_value: '2 Litres / 2 Kg' },
          { spec_key: 'Machine Compatibility', spec_value: 'Front & Top Loading Machines' },
          { spec_key: 'Fragrance Profile', spec_value: 'Ocean Breeze Freshness' },
          { spec_key: 'Doses Per Pack', spec_value: '40 Full Load Washes' }
        ],
        features: [
          '10x Bio-Enzyme Stain Dissolving Action',
          'Front Load & Top Load Machine Safe',
          '48-Hour Micro-Capsule Fragrance Lock',
          'Color Guard Technology Prevents Fading'
        ]
      },
      {
        sku: 'WM-LD-2L-PNK',
        model_number: 'WM-FB2000',
        name: 'White Mist Floral Bloom Liquid Detergent',
        slug: 'wm-pink-floral',
        category_slug: 'bottles',
        tagline: 'Rose Elegance Scent & Luxurious Fabric Touch',
        short_description: 'Enriched with natural floral essential oils and fabric conditioners.',
        description: 'White Mist Floral Bloom Liquid Detergent keeps whites glowing white and colors vivid while leaving your clothes velvet-soft with a captivating rose bouquet fragrance.',
        price: 499.00,
        discount_price: 349.00,
        badge: 'Top Rated',
        rating: 4.95,
        reviews_count: 980,
        color: 'pink',
        accent_color: '#F01262',
        bg_gradient: 'linear-gradient(135deg, #FFEBF2 0%, #FFFFFF 100%)',
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
          { url: '/assets/images/bottle_pink.png', isPrimary: true },
          { url: '/assets/images/pouch_pink.png', isPrimary: false }
        ],
        formats: [
          { format_code: 'bot-2l', name: '2L Ergonomic Handle Bottle', price: 349.00, mrp: 499.00, discount: '30% OFF', image: '/assets/images/bottle_pink.png', doses: 40 },
          { format_code: 'pouch-2l', name: '2kg Eco Spout Refill Pouch', price: 289.00, mrp: 399.00, discount: '27% OFF', image: '/assets/images/pouch_pink.png', doses: 40 }
        ],
        specs: [
          { spec_key: 'Net Quantity', spec_value: '2 Litres / 2 Kg' },
          { spec_key: 'Machine Compatibility', spec_value: 'Front & Top Loading Machines' },
          { spec_key: 'Fragrance Profile', spec_value: 'Pink Floral Bouquet' },
          { spec_key: 'Doses Per Pack', spec_value: '40 Full Load Washes' }
        ],
        features: [
          'Infused with Rose & Floral Botanical Extracts',
          'Built-in Fabric Softening & Fabric Guard',
          'Phosphate-Free Gentle on Sensitive Skin',
          'Dissolves 100% in Cold & Hot Water'
        ]
      },
      {
        sku: 'WM-LD-2L-YLW',
        model_number: 'WM-CS2000',
        name: 'White Mist Citrus Sunshine Liquid Detergent',
        slug: 'wm-yellow-citrus',
        category_slug: 'bottles',
        tagline: '10x Tough Oil & Grease Destroyer with Lemon Zest',
        short_description: 'Formulated with active citrus degreasers to eliminate oily collar grease, food splatters, and bacteria.',
        description: 'White Mist Citrus Sunshine Liquid Detergent eliminates tough oil and grease without pre-soaking, leaving laundry refreshingly zesty and clean.',
        price: 499.00,
        discount_price: 349.00,
        badge: 'Tough Stain Pick',
        rating: 4.88,
        reviews_count: 1250,
        color: 'yellow',
        accent_color: '#D97706',
        bg_gradient: 'linear-gradient(135deg, #FFFDE6 0%, #FFFFFF 100%)',
        capacity: 2,
        dimensions: '2L Bottle / 2kg',
        energy_rating: 'Front & Top Load',
        water_consumption: 0,
        noise_level: 0,
        wash_programs_count: 40,
        warranty_years: 2,
        stock_status: 'IN_STOCK',
        available_quantity: 130,
        images: [
          { url: '/assets/images/bottle_yellow.png', isPrimary: true },
          { url: '/assets/images/pouch_yellow.png', isPrimary: false }
        ],
        formats: [
          { format_code: 'bot-2l', name: '2L Ergonomic Handle Bottle', price: 349.00, mrp: 499.00, discount: '30% OFF', image: '/assets/images/bottle_yellow.png', doses: 40 },
          { format_code: 'pouch-2l', name: '2kg Eco Spout Refill Pouch', price: 289.00, mrp: 399.00, discount: '27% OFF', image: '/assets/images/pouch_yellow.png', doses: 40 }
        ],
        specs: [
          { spec_key: 'Net Quantity', spec_value: '2 Litres / 2 Kg' },
          { spec_key: 'Machine Compatibility', spec_value: 'Front & Top Loading Machines' },
          { spec_key: 'Fragrance Profile', spec_value: 'Citrus Lemon Sunshine' },
          { spec_key: 'Doses Per Pack', spec_value: '40 Full Load Washes' }
        ],
        features: [
          'Citrus Degreasing Enzymes for Collar & Cuff Grease',
          '99.9% Odor-Causing Bacteria Elimination',
          'High Efficiency Low Suds Liquid Technology',
          'Eco Spout Pouch & Ergonomic Bottle Formats'
        ]
      },
      {
        sku: 'FW-LD-2KG-SPOUT',
        model_number: 'FW-SP2000',
        name: 'Fun Wash™ Liquid Detergent 2kg Spout Pouch',
        slug: 'funwash-liquid-2kg',
        category_slug: 'funwash',
        tagline: 'High Quality Laundry Detergent • Special ₹99 Offer Pack',
        short_description: 'Mega Value 2kg Spout Refill Pouch by Fun Wash™. Designed for daily laundry at just ₹99!',
        description: 'Fun Wash™ 2kg Spout Refill Pouch is designed for daily family laundry, removing tough dirt effortlessly while staying ultra-gentle on your pocket at just ₹99!',
        price: 199.00,
        discount_price: 99.00,
        badge: '₹99 Special Offer',
        rating: 4.92,
        reviews_count: 3100,
        color: 'yellow',
        accent_color: '#EAB308',
        bg_gradient: 'linear-gradient(135deg, #FEF08A 0%, #FFFFFF 100%)',
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
          { url: '/assets/images/pouch_yellow_lifestyle.jpg', isPrimary: true }
        ],
        formats: [
          { format_code: 'pouch-2kg', name: '2kg Eco Spout Refill Pouch', price: 99.00, mrp: 199.00, discount: '50% OFF', image: '/assets/images/pouch_yellow_lifestyle.jpg', doses: 40 }
        ],
        specs: [
          { spec_key: 'Net Quantity', spec_value: '2 Kg Spout Pouch' },
          { spec_key: 'Price Offer', spec_value: '₹99 Special Launch Price' },
          { spec_key: 'Compatibility', spec_value: 'Front & Top Load Washing Machines' }
        ],
        features: [
          'Super Saver Offer Pack at ₹99 Only!',
          'Easy Pour Spout with Screw Cap Leak Protection',
          'Works in All Front Load & Top Load Washing Machines',
          'Softens Fabric and Leaves Fresh Long-Lasting Fragrance'
        ]
      },
      {
        sku: 'WM-COMBO-TWIN-BOT',
        model_number: 'WM-CB4000',
        name: 'White Mist Twin Bottle Super Saver Pack (4L)',
        slug: 'wm-combo-twin-bottles',
        category_slug: 'combos',
        tagline: '2x 2L Bottles (Ocean Blue + Floral Pink Combo)',
        short_description: 'Get 4 Litres of premium laundry care with dual fragrances for 80 washes.',
        description: 'Get 4 Litres of premium laundry care! Includes 1x 2L Ocean Fresh Bottle + 1x 2L Floral Bloom Bottle. Complete 80-wash solution with maximum savings.',
        price: 998.00,
        discount_price: 649.00,
        badge: 'Mega Combo',
        rating: 4.97,
        reviews_count: 850,
        color: 'blue',
        accent_color: '#3F1B85',
        bg_gradient: 'linear-gradient(135deg, #E0E7FF 0%, #FFFFFF 100%)',
        capacity: 4,
        dimensions: '2x 2L Bottles',
        energy_rating: 'Front & Top Load',
        water_consumption: 0,
        noise_level: 0,
        wash_programs_count: 80,
        warranty_years: 2,
        stock_status: 'IN_STOCK',
        available_quantity: 80,
        images: [
          { url: '/assets/images/bottle_blue.png', isPrimary: true }
        ],
        formats: [
          { format_code: 'twin-bot-4l', name: '2x 2L Bottle Twin Pack', price: 649.00, mrp: 998.00, discount: '35% OFF', image: '/assets/images/bottle_blue.png', doses: 80 }
        ],
        specs: [
          { spec_key: 'Combo Contents', spec_value: '2L Ocean Blue + 2L Floral Pink' },
          { spec_key: 'Total Washes', spec_value: '80 Full Load Washes' }
        ],
        features: [
          'Includes 2 Full Size 2L Ergonomic Bottles',
          'Dual Fragrance Experience (Ocean Fresh & Floral Bloom)',
          'Free Nationwide Delivery Unlocked',
          'Saves ₹349 Compared to MRP'
        ]
      },
      {
        sku: 'WM-COMBO-POUCH-DUO',
        model_number: 'WM-CP4000',
        name: 'White Mist Eco Spout Refill Pouch Duo (4kg)',
        slug: 'wm-combo-pouch-duo',
        category_slug: 'combos',
        tagline: '2x 2kg Eco Spout Refill Pouches (Yellow + Pink)',
        short_description: '80% Less Plastic Packaging! Contains 2x 2kg Spout Refill Pouches.',
        description: '80% Less Plastic Packaging! Contains 2x 2kg Spout Refill Pouches (Citrus Sunshine + Floral Bloom). Easy to pour directly into your reusable White Mist bottles.',
        price: 798.00,
        discount_price: 539.00,
        badge: 'Eco Saver',
        rating: 4.93,
        reviews_count: 620,
        color: 'pink',
        accent_color: '#F01262',
        bg_gradient: 'linear-gradient(135deg, #FCE7F3 0%, #FFFFFF 100%)',
        capacity: 4,
        dimensions: '2x 2kg Pouches',
        energy_rating: 'Front & Top Load',
        water_consumption: 0,
        noise_level: 0,
        wash_programs_count: 80,
        warranty_years: 2,
        stock_status: 'IN_STOCK',
        available_quantity: 90,
        images: [
          { url: '/assets/images/pouch_pink.png', isPrimary: true }
        ],
        formats: [
          { format_code: 'pouch-duo-4kg', name: '2x 2kg Eco Spout Pouch Duo', price: 539.00, mrp: 798.00, discount: '32% OFF', image: '/assets/images/pouch_pink.png', doses: 80 }
        ],
        specs: [
          { spec_key: 'Combo Contents', spec_value: '2kg Citrus Yellow + 2kg Floral Pink' },
          { spec_key: 'Total Washes', spec_value: '80 Full Load Washes' }
        ],
        features: [
          'Includes 2x 2kg Eco Spout Refill Pouches',
          'Smart Spout Design with Spill-Proof Cap',
          'Reduces Household Plastic Footprint by 80%',
          'Maximum Value for Daily Household Laundry'
        ]
      }
    ];

    for (const p of productsList) {
      const categoryId = catMap[p.category_slug] || 1;

      await query(
        `INSERT INTO products (
           sku, model_number, name, slug, category_id, tagline, short_description,
           description, price, discount_price, badge, rating, reviews_count,
           color, accent_color, bg_gradient,
           capacity, dimensions, energy_rating, water_consumption, noise_level,
           wash_programs_count, warranty_years, stock_status, available_quantity
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE 
           name=VALUES(name), discount_price=VALUES(discount_price), 
           price=VALUES(price), available_quantity=VALUES(available_quantity),
           rating=VALUES(rating), reviews_count=VALUES(reviews_count),
           color=VALUES(color), accent_color=VALUES(accent_color), bg_gradient=VALUES(bg_gradient)`,
        [
          p.sku, p.model_number, p.name, p.slug, categoryId, p.tagline,
          p.short_description, p.description, p.price, p.discount_price, p.badge,
          p.rating, p.reviews_count, p.color, p.accent_color, p.bg_gradient,
          p.capacity, p.dimensions, p.energy_rating, p.water_consumption,
          p.noise_level, p.wash_programs_count, p.warranty_years, p.stock_status, p.available_quantity
        ]
      );

      // Fetch accurate product ID
      const rows = await query('SELECT id FROM products WHERE sku = ?', [p.sku]);
      const productId = rows[0]?.id;

      if (!productId) continue;

      // Product Images
      await query('DELETE FROM product_images WHERE product_id = ?', [productId]);
      if (p.images && p.images.length > 0) {
        let order = 1;
        for (const img of p.images) {
          await query(
            `INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (?, ?, ?, ?)`,
            [productId, img.url, img.isPrimary, order++]
          );
        }
      }

      // Product Formats
      await query('DELETE FROM product_formats WHERE product_id = ?', [productId]);
      if (p.formats && p.formats.length > 0) {
        let order = 1;
        for (const fmt of p.formats) {
          await query(
            `INSERT INTO product_formats (product_id, format_code, name, price, mrp, discount, image, doses, display_order)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [productId, fmt.format_code, fmt.name, fmt.price, fmt.mrp, fmt.discount, fmt.image, fmt.doses, order++]
          );
        }
      }

      // Specifications
      await query('DELETE FROM product_specifications WHERE product_id = ?', [productId]);
      let specOrder = 1;
      for (const s of p.specs) {
        await query(
          `INSERT INTO product_specifications (product_id, spec_key, spec_value, display_order) VALUES (?, ?, ?, ?)`,
          [productId, s.spec_key, s.spec_value, specOrder++]
        );
      }

      // Features
      await query('DELETE FROM product_features WHERE product_id = ?', [productId]);
      let featOrder = 1;
      for (const feat of p.features) {
        await query(
          `INSERT INTO product_features (product_id, feature_text, display_order) VALUES (?, ?, ?)`,
          [productId, feat, featOrder++]
        );
      }
    }

    // 5. Super Saver Bundle
    const bundles = [
      {
        bundle_code: 'wm-super-bundle-laundry',
        title: 'White Mist 4kg Mega Saver Laundry Bundle',
        subtitle: '2L Bottle + 2kg Refill Pouch + Free Measuring Cap',
        price: 599.00,
        mrp: 898.00,
        savings: 'Save ₹299 (33% OFF)',
        image: '/assets/images/bottle_blue.png',
      }
    ];

    for (const b of bundles) {
      await query(
        `INSERT INTO bundles (bundle_code, title, subtitle, price, mrp, savings, image)
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE title=VALUES(title), price=VALUES(price), mrp=VALUES(mrp)`,
        [b.bundle_code, b.title, b.subtitle, b.price, b.mrp, b.savings, b.image]
      );
    }

    // 6. Customer Reviews
    const reviews = [
      {
        author: 'Sunita Deshmukh',
        role: 'Verified Buyer',
        city: 'Mumbai',
        rating: 5,
        comment: 'White Mist Ocean Fresh liquid detergent is fantastic for our front load machine! Dirty cuffs and grease stains wash out easily without scrubbing.',
      },
      {
        author: 'Priya Sharma',
        role: 'Verified Buyer',
        city: 'Delhi NCR',
        rating: 5,
        comment: 'The Fun Wash ₹99 2kg pouch offer is unbeatable! Amazing lather, fresh smell, and so economical for daily family laundry.',
      },
      {
        author: 'Ananya Iyer',
        role: 'Verified Buyer',
        city: 'Bangalore',
        rating: 5,
        comment: 'Love the Pink Floral Bloom bottle. Leaves clothes so soft and smelling like fresh roses even 2 days after washing.',
      },
      {
        author: 'Rajesh Khanna',
        role: 'Verified Buyer',
        city: 'Hyderabad',
        rating: 5,
        comment: 'Citrus Sunshine is the best for curry stains. Cleaned turmeric stains completely in a quick 30-min wash cycle!',
      }
    ];

    await query('DELETE FROM reviews WHERE is_approved = TRUE');
    for (const r of reviews) {
      await query(
        `INSERT INTO reviews (author, role, city, rating, comment, is_approved)
         VALUES (?, ?, ?, ?, ?, TRUE)`,
        [r.author, r.role, r.city, r.rating, r.comment]
      );
    }

    // 7. Promo Codes
    const promoCodes = [
      { code: 'MISTWELCOME10', discount: 10.00, type: 'percent', desc: '10% Welcome Discount', min_order: 299 },
      { code: 'WHITEMIST2026', discount: 100.00, type: 'flat', desc: '₹100 Flat Savings', min_order: 499 },
      { code: 'FUNWASH99', discount: 50.00, type: 'flat', desc: '₹50 Extra Off on Fun Wash', min_order: 198 }
    ];

    for (const pc of promoCodes) {
      await query(
        `INSERT INTO promo_codes (code, discount, discount_type, description, min_order_amount)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE discount=VALUES(discount), discount_type=VALUES(discount_type), description=VALUES(description)`,
        [pc.code, pc.discount, pc.type, pc.desc, pc.min_order]
      );
    }

    // 8. Warranties (Verified Appliance & Dispenser Guarantees)
    const warranties = [
      {
        warranty_code: 'WM-WAR-2026-001',
        customer_name: 'Rahul Verma',
        customer_email: 'customer@example.com',
        product_id: 1,
        model_number: 'WM-OF2000',
        serial_number: 'WM-DW-2026-9948',
        purchase_date: '2026-01-15',
        warranty_start_date: '2026-01-15',
        warranty_end_date: '2028-01-15',
        status: 'ACTIVE'
      },
      {
        warranty_code: 'WM-WAR-2026-002',
        customer_name: 'Sunita Deshmukh',
        customer_email: 'sunita@example.com',
        product_id: 2,
        model_number: 'WM-FB2000',
        serial_number: 'WM-FB2000-4491',
        purchase_date: '2026-02-10',
        warranty_start_date: '2026-02-10',
        warranty_end_date: '2028-02-10',
        status: 'ACTIVE'
      }
    ];

    for (const w of warranties) {
      await query(
        `INSERT INTO warranties (warranty_code, customer_name, customer_email, product_id, model_number, serial_number, purchase_date, warranty_start_date, warranty_end_date, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE status=VALUES(status)`,
        [w.warranty_code, w.customer_name, w.customer_email, w.product_id, w.model_number, w.serial_number, w.purchase_date, w.warranty_start_date, w.warranty_end_date, w.status]
      );
    }

    logger.info('MySQL Database seeding completed successfully! All 6 products, formats, categories, reviews, bundles, promo codes, and warranties are fully persisted.');
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
