import { pool } from '../../database/config.js';

class ProductRepository {
  /**
   * Create a new product
   */
  async create(data) {
    const sql = `
      INSERT INTO tbl_product (
        title, description, seller_id, price, currency, category, tags, images,
        quantity, is_digital, delivery_method, estimated_delivery, status, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), NOW()
      )
      RETURNING *
    `;

    const values = [
      data.title,
      data.description,
      data.sellerId,
      data.price,
      data.currency || 4, // Default to BRL
      data.category,
      data.tags || [],
      data.images || [],
      data.quantity || 1,
      data.isDigital || false,
      data.deliveryMethod || null,
      data.estimatedDelivery || null,
      1 // ACTIVE status
    ];

    const result = await pool.query(sql, values);
    return this.mapRow(result.rows[0]);
  }

  /**
   * Find all products with optional filters
   */
  async findAll(filters = {}) {
    const { search, category, currency } = filters;
    
    let sql = `
      SELECT * FROM tbl_product
      WHERE status = 1
    `;
    
    const values = [];
    let paramCount = 1;

    if (search) {
      sql += ` AND (title ILIKE $${paramCount} OR description ILIKE $${paramCount})`;
      values.push(`%${search}%`);
      paramCount++;
    }

    if (category) {
      sql += ` AND category = $${paramCount}`;
      values.push(category);
      paramCount++;
    }

    if (currency) {
      sql += ` AND currency = $${paramCount}`;
      values.push(parseInt(currency));
      paramCount++;
    }

    sql += ` ORDER BY created_at DESC`;

    const result = await pool.query(sql, values);
    return result.rows.map(row => this.mapRow(row));
  }

  /**
   * Find product by ID
   */
  async findById(id) {
    const sql = 'SELECT * FROM tbl_product WHERE product_id = $1';
    const result = await pool.query(sql, [id]);
    return result.rows.length > 0 ? this.mapRow(result.rows[0]) : null;
  }

  /**
   * Find product by external ID (UUID)
   * @deprecated Use findById instead - external_id removed from schema
   */
  async findByExternalId(externalId) {
    return this.findById(externalId);
  }

  /**
   * Increment view count
   */
  async incrementViewCount(id) {
    const sql = `
      UPDATE tbl_product 
      SET view_count = view_count + 1 
      WHERE product_id = $1
      RETURNING view_count
    `;
    
    const result = await pool.query(sql, [id]);
    return { viewCount: result.rows[0]?.view_count || 0 };
  }

  /**
   * Map database row to product object
   */
  mapRow(row) {
    if (!row) return null;

    return {
      productId: row.product_id,
      title: row.title,
      description: row.description,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      sellerId: row.seller_id?.toString(),
      price: parseFloat(row.price),
      currency: this.getCurrencyCode(row.currency),
      tags: row.tags || [],
      category: row.category,
      status: this.getStatusCode(row.status),
      images: row.images || [],
      quantity: row.quantity,
      isDigital: row.is_digital,
      deliveryMethod: this.getDeliveryMethodCode(row.delivery_method),
      estimatedDelivery: row.estimated_delivery,
      viewCount: row.view_count,
      soldCount: row.sold_count
    };
  }

  /**
   * Get currency code from integer
   */
  getCurrencyCode(code) {
    const currencies = {
      1: 'ETH',
      2: 'BTC',
      3: 'USDT',
      4: 'BRL'
    };
    return currencies[code] || 'BRL';
  }

  /**
   * Get status code from integer
   */
  getStatusCode(code) {
    const statuses = {
      1: 'ACTIVE',
      2: 'SOLD_OUT',
      3: 'DELETED',
      4: 'PENDING_REVIEW',
      5: 'ARCHIVED'
    };
    return statuses[code] || 'ACTIVE';
  }

  /**
   * Get delivery method code from integer
   */
  getDeliveryMethodCode(code) {
    if (!code) return null;
    const methods = {
      1: 'DIGITAL_LINK',
      2: 'PHYSICAL_SHIPPING',
      3: 'PICKUP'
    };
    return methods[code] || null;
  }

  /**
   * Get delivery method integer from code
   */
  getDeliveryMethodInt(code) {
    if (!code) return null;
    const methods = {
      'DIGITAL_LINK': 1,
      'PHYSICAL_SHIPPING': 2,
      'PICKUP': 3
    };
    return methods[code] || null;
  }

  /**
   * Get currency integer from code
   */
  getCurrencyInt(code) {
    const currencies = {
      'ETH': 1,
      'BTC': 2,
      'USDT': 3,
      'BRL': 4
    };
    return currencies[code] || 4;
  }
}

export default new ProductRepository();
