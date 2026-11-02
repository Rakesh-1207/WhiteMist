import { query } from '../database/db.js';

export class ProductRepository {
  static formatProduct(p) {
    if (!p) return null;
    return {
      id: p.slug, // Frontend uses slug as primary identifier
      dbId: p.id,
      sku: p.sku,
      modelNumber: p.model_number,
      name: p.name,
      slug: p.slug,
      category: p.category_slug || 'bottles',
      categoryName: p.category_name,
      tagline: p.tagline,
      color: p.color || 'blue',
      accentColor: p.accent_color || '#0084FF',
      bgGradient: p.bg_gradient || 'linear-gradient(135deg, #E6F3FF 0%, #FFFFFF 100%)',
      badge: p.badge,
      rating: parseFloat(p.rating || 4.90),
      reviewsCount: parseInt(p.reviews_count || 100, 10),
      price: p.discount_price ? parseFloat(p.discount_price) : parseFloat(p.price),
      mrp: parseFloat(p.price),
      capacity: p.dimensions || `${p.capacity}L / ${p.capacity}kg`,
      energyRating: p.energy_rating || 'Front & Top Load',
      waterConsumption: p.water_consumption || 'Low Foam Tech',
      noiseLevel: p.noise_level || 'Color Safe',
      washPrograms: p.wash_programs_count || 40,
      warrantyYears: p.warranty_years || 2,
      description: p.description || p.short_description,
      stockStatus: p.stock_status,
      availableQuantity: p.available_quantity,
      formats: (p.formats || []).map(f => ({
        id: f.id || f.format_code,
        name: f.name,
        price: parseFloat(f.price),
        mrp: parseFloat(f.mrp),
        discount: f.discount,
        image: f.image,
        doses: f.doses || 40,
      })),
      features: p.features || [],
      specs: (p.specs || []).map(s => ({
        name: s.spec_key || s.name,
        value: s.spec_value || s.value,
      })),
      images: (p.images || []).map(img => typeof img === 'string' ? img : img.image_url),
    };
  }

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
    limit = 20,
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

    // Attach formats, images, specs & features from DB
    for (const prod of products) {
      prod.images = await this.getProductImages(prod.id);
      prod.specs = await this.getProductSpecs(prod.id);
      prod.features = await this.getProductFeatures(prod.id);
      prod.formats = await this.getProductFormats(prod.id);
    }

    return products.map(p => this.formatProduct(p));
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
    product.formats = await this.getProductFormats(product.id);
    return this.formatProduct(product);
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
    product.formats = await this.getProductFormats(product.id);
    return this.formatProduct(product);
  }

  static async findByIdOrSlug(idOrSlug) {
    if (!isNaN(idOrSlug)) {
      const byId = await this.findById(idOrSlug);
      if (byId) return byId;
    }
    return this.findBySlug(idOrSlug);
  }

  static async getSuperSaverBundle() {
    const sql = `SELECT bundle_code as id, title, subtitle, price, mrp, savings, image FROM bundles WHERE is_active = TRUE LIMIT 1`;
    const rows = await query(sql);
    if (!rows[0]) return null;
    const b = rows[0];
    return {
      id: b.id,
      title: b.title,
      subtitle: b.subtitle,
      price: parseFloat(b.price),
      mrp: parseFloat(b.mrp),
      savings: b.savings,
      image: b.image,
    };
  }

  static async create(productData) {
    const sql = `
      INSERT INTO products (
        sku, model_number, name, slug, category_id, tagline, short_description,
        description, price, discount_price, badge, capacity, dimensions,
        energy_rating, water_consumption, noise_level, wash_programs_count,
        warranty_years, stock_status, available_quantity, status, video_url,
        color, accent_color, bg_gradient
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
      productData.capacity || 2,
      productData.dimensions || null,
      productData.energy_rating || 'Front & Top Load',
      productData.water_consumption || 0,
      productData.noise_level || 0,
      productData.wash_programs_count || 40,
      productData.warranty_years || 2,
      productData.stock_status || 'IN_STOCK',
      productData.available_quantity || 50,
      productData.status || 'ACTIVE',
      productData.video_url || null,
      productData.color || 'blue',
      productData.accent_color || '#0084FF',
      productData.bg_gradient || 'linear-gradient(135deg, #E6F3FF 0%, #FFFFFF 100%)',
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

    if (productData.formats && productData.formats.length > 0) {
      for (let i = 0; i < productData.formats.length; i++) {
        const fmt = productData.formats[i];
        await query(
          `INSERT INTO product_formats (product_id, format_code, name, price, mrp, discount, image, doses, display_order)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [productId, fmt.id || fmt.format_code, fmt.name, fmt.price, fmt.mrp, fmt.discount || '0% OFF', fmt.image, fmt.doses || 40, i + 1]
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
      productData.capacity || 2,
      productData.energy_rating || 'Front & Top Load',
      productData.water_consumption || 0,
      productData.noise_level || 0,
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

  static async getProductFormats(productId) {
    const sql = `SELECT format_code as id, name, price, mrp, discount, image, doses FROM product_formats WHERE product_id = ? ORDER BY display_order ASC`;
    return query(sql, [productId]);
  }
}
