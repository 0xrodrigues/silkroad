import orderRepository from './order.repository.js';

class OrderService {
  /**
   * Create a new order
   */
  async create(data) {
    // Validate required fields
    if (!data.productId || !data.buyerId || !data.sellerId) {
      throw new Error('Product ID, Buyer ID, and Seller ID are required');
    }

    if (!data.quantity || data.quantity <= 0) {
      throw new Error('Quantity must be greater than 0');
    }

    if (!data.price || data.price <= 0) {
      throw new Error('Price must be greater than 0');
    }

    if (!data.paymentMethod) {
      throw new Error('Payment method is required');
    }

    return await orderRepository.create(data);
  }

  /**
   * List orders by buyer
   */
  async listByBuyer(buyerId) {
    if (!buyerId) {
      throw new Error('Buyer ID is required');
    }

    return await orderRepository.findByBuyer(buyerId);
  }

  /**
   * List orders by seller
   */
  async listBySeller(sellerId) {
    if (!sellerId) {
      throw new Error('Seller ID is required');
    }

    return await orderRepository.findBySeller(sellerId);
  }

  /**
   * Update order status
   */
  async updateStatus(orderId, data) {
    if (!orderId) {
      throw new Error('Order ID is required');
    }

    // Check if order exists
    const order = await orderRepository.findById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    // Convert string status codes to integers if provided
    const status = data.status 
      ? (typeof data.status === 'string' ? orderRepository.getOrderStatusInt(data.status) : data.status)
      : orderRepository.getOrderStatusInt(order.status);
    
    const paymentStatus = data.paymentStatus 
      ? (typeof data.paymentStatus === 'string' ? orderRepository.getPaymentStatusInt(data.paymentStatus) : data.paymentStatus)
      : orderRepository.getPaymentStatusInt(order.paymentStatus);
    
    const shippingStatus = data.shippingStatus 
      ? (typeof data.shippingStatus === 'string' ? orderRepository.getShippingStatusInt(data.shippingStatus) : data.shippingStatus)
      : orderRepository.getShippingStatusInt(order.shippingStatus);

    return await orderRepository.updateStatus(orderId, status, paymentStatus, shippingStatus);
  }
}

export default new OrderService();
