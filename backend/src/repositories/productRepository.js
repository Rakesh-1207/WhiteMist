import { query } from '../database/db.js';

export class ProductRepository {
  static async findAll({
    search,
    category,
    minPrice,
    maxPrice,
    capacity,
    energyRating,
    noiseLevel,
    availability,
    sortBy = 'created_at',
    sortOrder = 'DESC',
    page = 1,
    limit = 12,
  }) {
    const offset = (page - 1) * limit;
    let sql = `
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      JOIN product_categories c ON p.category_id = c.id
      WHERE p.deleted_at IS NULL AND p.status = 'ACTIVE'
    `;
    const params = [];

    if (search) {
      sql += ` AND (p.name LIKE ? OR p.sku LIKE ? OR p.model_number LIKE ? OR p.description LIKE ?)`;
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern, searchPattern);
    }

    if (category && category !== 'all') {
      sql += ` AND (c.slug = ? OR c.id = ?)`;
      params.push(category, category);
    }

    if (minPrice) {
      sql += ` AND p.price >= ?`;
      params.push(parseFloat(minPrice));
    }

    if (maxPrice) {
      sql += ` AND p.price <= ?`;
      params.push(parseFloat(maxPrice));
    }

    if (capacity) {
      sql += ` AND p.capacity >= ?`;
      params.push(parseInt(capacity, 10));
    }

    if (energyRating) {
      sql += ` AND p.energy_rating LIKE ?`;
      params.push(`%${energyRating}%`);
    }

    if (noiseLevel) {
      sql += ` AND p.noise_level <= ?`;
      params.push(parseInt(noiseLevel, 10));
    }

    if (availability) {
      sql += ` AND p.stock_status = ?`;
      params.push(availability);
    }

    // Sorting
    const validSortFields = ['price', 'created_at', 'rating', 'name', 'capacity'];
    const sortField = validSortFields.includes(sortBy) ? `p.${sortBy}` : 'p.created_at';
    const order = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    sql += ` ORDER BY ${sortField} ${order} LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}`;

    const products = await query(sql, params);

    // Attach primary images, specs & features
    for (const prod of products) {
      prod.images = await this.getProductImages(prod.id);
      prod.specs = await this.getProductSpecs(prod.id);
      prod.features = await this.getProductFeatures(prod.id);
    }

    return products;
  }

  static async countAll({ search, category, minPrice, maxPrice, capacity, energyRating, noiseLevel, availability }) {
    let sql = `
      SELECT COUNT(*) as count
      FROM products p
      JOIN product_categories c ON p.category_id = c.id
      WHERE p.deleted_at IS NULL AND p.status = 'ACTIVE'
    `;
    const params = [];

    if (search) {
      sql += ` AND (p.name LIKE ? OR p.sku LIKE ? OR p.model_number LIKE ? OR p.description LIKE ?)`;
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern, searchPattern);
    }

    if (category && category !== 'all') {
      sql += ` AND (c.slug = ? OR c.id = ?)`;
      params.push(category, category);
    }

    if (minPrice) {
      sql += ` AND p.price >= ?`;
      params.push(parseFloat(minPrice));
    }

    if (maxPrice) {
      sql += ` AND p.price <= ?`;
      params.push(parseFloat(maxPrice));
    }

    if (capacity) {
      sql += ` AND p.capacity >= ?`;
      params.push(parseInt(capacity, 10));
    }

    if (energyRating) {
      sql += ` AND p.energy_rating LIKE ?`;
      params.push(`%${energyRating}%`);
    }

    if (noiseLevel) {
      sql += ` AND p.noise_level <= ?`;
      params.push(parseInt(noiseLevel, 10));
    }

    if (availability) {
      sql += ` AND p.stock_status = ?`;
      params.push(availability);
    }

    const rows = await query(sql, params);
    return rows[0]?.count || 0;
  }

  static async findById(id) {
    const sql = `
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      JOIN product_categories c ON p.category_id = c.id
      WHERE p.id = ? AND p.deleted_at IS NULL
    `;
    const rows = await query(sql, [id]);
    if (!rows[0]) return null;

    const product = rows[0];
    product.images = await this.getProductImages(product.id);
    product.specs = await this.getProductSpecs(product.id);
    product.features = await this.getProductFeatures(product.id);
    return product;
  }

  static async findBySlug(slug) {
    const sql = `
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      JOIN product_categories c ON p.category_id = c.id
      WHERE p.slug = ? AND p.deleted_at IS NULL
    `;
    const rows = await query(sql, [slug]);
    if (!rows[0]) return null;

    const product = rows[0];
    product.images = await this.getProductImages(product.id);
    product.specs = await this.getProductSpecs(product.id);
    product.features = await this.getProductFeatures(product.id);
    return product;
  }

  static async create(productData) {
    const sql = `
      INSERT INTO products (
        sku, model_number, name, slug, category_id, tagline, short_description,
        description, price, discount_price, badge, capacity, dimensions,
        energy_rating, water_consumption, noise_level, wash_programs_count,
        warranty_years, stock_status, available_quantity, status, video_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      productData.sku,
      productData.model_number,
      productData.name,
      productData.slug || productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      productData.category_id,
      productData.tagline || null,
      productData.short_description || null,
      productData.description || null,
      productData.price,
      productData.discount_price || null,
      productData.badge || null,
      productData.capacity || 12,
      productData.dimensions || null,
      productData.energy_rating || '5 Star',
      productData.water_consumption || 9.5,
      productData.noise_level || 44,
      productData.wash_programs_count || 6,
      productData.warranty_years || 2,
      productData.stock_status || 'IN_STOCK',
      productData.available_quantity || 50,
      productData.status || 'ACTIVE',
      productData.video_url || null,
    ];

    const result = await query(sql, params);
    const productId = result.insertId;

    if (productData.images && productData.images.length > 0) {
      for (let i = 0; i < productData.images.length; i++) {
        const img = productData.images[i];
        const imgUrl = typeof img === 'string' ? img : img.image_url;
        await query(
          `INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (?, ?, ?, ?)`,
          [productId, imgUrl, i === 0, i + 1]
        );
      }
    }

    return this.findById(productId);
  }

  static async update(id, productData) {
    const sql = `
      UPDATE products SET
        name = ?, price = ?, discount_price = ?, tagline = ?, description = ?,
        capacity = ?, energy_rating = ?, water_consumption = ?, noise_level = ?,
        stock_status = ?, available_quantity = ?, status = ?
      WHERE id = ? AND deleted_at IS NULL
    `;
    await query(sql, [
      productData.name,
      productData.price,
      productData.discount_price || null,
      productData.tagline || null,
      productData.description || null,
      productData.capacity || 12,
      productData.energy_rating || '5 Star',
      productData.water_consumption || 9.5,
      productData.noise_level || 44,
      productData.stock_status || 'IN_STOCK',
      productData.available_quantity || 50,
      productData.status || 'ACTIVE',
      id,
    ]);
    return this.findById(id);
  }

  static async softDelete(id) {
    const sql = `UPDATE products SET deleted_at = NOW(), status = 'ARCHIVED' WHERE id = ?`;
    await query(sql, [id]);
    return true;
  }

  static async getProductImages(productId) {
    const sql = `SELECT * FROM product_images WHERE product_id = ? ORDER BY display_order ASC`;
    return query(sql, [productId]);
  }

  static async getProductSpecs(productId) {
    const sql = `SELECT * FROM product_specifications WHERE product_id = ? ORDER BY display_order ASC`;
    return query(sql, [productId]);
  }

  static async getProductFeatures(productId) {
    const sql = `SELECT * FROM product_features WHERE product_id = ? ORDER BY display_order ASC`;
    const rows = await query(sql, [productId]);
    return rows.map(r => r.feature_text);
  }
}
