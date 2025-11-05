import orderService from './order.service.js';

class OrderController {
  /**
   * Create a new order
   * POST /api/orders
   */
  async create(req, res, next) {
    try {
      const order = await orderService.create(req.body);
      res.status(201).json(order);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * List orders by buyer
   * GET /api/orders/buyer/:buyerId
   */
  async listByBuyer(req, res, next) {
    try {
      const orders = await orderService.listByBuyer(req.params.buyerId);
      res.json(orders);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * List orders by seller
   * GET /api/orders/seller/:sellerId
   */
  async listBySeller(req, res, next) {
    try {
      const orders = await orderService.listBySeller(req.params.sellerId);
      res.json(orders);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Update order status
   * PUT /api/orders/:orderId/status
   */
  async updateStatus(req, res, next) {
    try {
      const order = await orderService.updateStatus(req.params.orderId, req.body);
      res.json({ message: 'Order status updated successfully.', order });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default new OrderController();
