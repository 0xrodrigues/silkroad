import { pool } from '../../database/config.js';

class OrderRepository {
  /**
   * Create a new order
   */
  async create(data) {
    const sql = `
      INSERT INTO tbl_order (
        product_id, buyer_id, seller_id, quantity, price, payment_method,
        shipping_address, notes, status, payment_status, shipping_status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 1, 1, $9)
      RETURNING *
    `;

    const values = [
      data.productId,
      data.buyerId,
      data.sellerId,
      data.quantity,
      data.price,
      data.paymentMethod,
      data.shippingAddress,
      data.notes || null,
      data.shippingStatus || 1 // Default: Digital or non-shippable
    ];

    const result = await pool.query(sql, values);
    return this.mapRow(result.rows[0]);
  }

  /**
   * Find orders by buyer ID
   */
  async findByBuyer(buyerId) {
    const sql = `
      SELECT o.* FROM tbl_order o 
      WHERE o.buyer_id = $1 
      ORDER BY o.created_at DESC
    `;
    
    const result = await pool.query(sql, [buyerId]);
    return result.rows.map(row => this.mapRow(row));
  }

  /**
   * Find orders by seller ID
   */
  async findBySeller(sellerId) {
    const sql = `
      SELECT o.* FROM tbl_order o 
      WHERE o.seller_id = $1 
      ORDER BY o.created_at DESC
    `;
    
    const result = await pool.query(sql, [sellerId]);
    return result.rows.map(row => this.mapRow(row));
  }

  /**
   * Update order status
   */
  async updateStatus(orderId, status, paymentStatus, shippingStatus) {
    const sql = `
      UPDATE tbl_order
      SET status = $1, payment_status = $2, shipping_status = $3
      WHERE order_id = $4
      RETURNING *
    `;

    const result = await pool.query(sql, [status, paymentStatus, shippingStatus, orderId]);
    return result.rows.length > 0 ? this.mapRow(result.rows[0]) : null;
  }

  /**
   * Find order by ID
   */
  async findById(orderId) {
    const sql = 'SELECT * FROM tbl_order WHERE order_id = $1';
    const result = await pool.query(sql, [orderId]);
    return result.rows.length > 0 ? this.mapRow(result.rows[0]) : null;
  }

  /**
   * Map database row to order object
   */
  mapRow(row) {
    if (!row) return null;

    return {
      orderId: row.order_id,
      productId: row.product_id,
      buyerId: row.buyer_id,
      sellerId: row.seller_id,
      quantity: row.quantity,
      price: parseFloat(row.price),
      totalAmount: parseFloat(row.total_amount),
      paymentMethod: row.payment_method,
      shippingAddress: row.shipping_address,
      notes: row.notes,
      status: this.getOrderStatusCode(row.status),
      paymentStatus: this.getPaymentStatusCode(row.payment_status),
      shippingStatus: this.getShippingStatusCode(row.shipping_status),
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  /**
   * Get order status code from integer
   */
  getOrderStatusCode(code) {
    const statuses = {
      1: 'CREATED',
      2: 'PROCESSING',
      3: 'COMPLETED',
      4: 'CANCELLED'
    };
    return statuses[code] || 'CREATED';
  }

  /**
   * Get payment status code from integer
   */
  getPaymentStatusCode(code) {
    const statuses = {
      1: 'PENDING',
      2: 'COMPLETED',
      3: 'FAILED',
      4: 'REFUNDED'
    };
    return statuses[code] || 'PENDING';
  }

  /**
   * Get shipping status code from integer
   */
  getShippingStatusCode(code) {
    const statuses = {
      1: 'DIGITAL',
      2: 'AWAITING_SHIPMENT',
      3: 'IN_TRANSIT',
      4: 'DELIVERED'
    };
    return statuses[code] || 'DIGITAL';
  }

  /**
   * Get order status integer from code
   */
  getOrderStatusInt(code) {
    const statuses = {
      'CREATED': 1,
      'PROCESSING': 2,
      'COMPLETED': 3,
      'CANCELLED': 4
    };
    return statuses[code] || 1;
  }

  /**
   * Get payment status integer from code
   */
  getPaymentStatusInt(code) {
    const statuses = {
      'PENDING': 1,
      'COMPLETED': 2,
      'FAILED': 3,
      'REFUNDED': 4
    };
    return statuses[code] || 1;
  }

  /**
   * Get shipping status integer from code
   */
  getShippingStatusInt(code) {
    const statuses = {
      'DIGITAL': 1,
      'AWAITING_SHIPMENT': 2,
      'IN_TRANSIT': 3,
      'DELIVERED': 4
    };
    return statuses[code] || 1;
  }
}

export default new OrderRepository();
