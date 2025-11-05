const API_BASE = '/api';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(error.error || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Products
  async getProducts(search = '') {
    const params = search ? `?search=${encodeURIComponent(search)}` : '';
    return this.request(`/products${params}`);
  }

  async getProduct(id) {
    return this.request(`/products/${id}`);
  }

  async createProduct(product) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(product),
    });
  }

  async incrementView(id) {
    return this.request(`/products/${id}/view`, {
      method: 'PATCH',
    });
  }

  // Orders
  async createOrder(order) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(order),
    });
  }

  async getOrdersByBuyer(buyerId) {
    return this.request(`/orders/buyer/${buyerId}`);
  }

  async getOrdersBySeller(sellerId) {
    return this.request(`/orders/seller/${sellerId}`);
  }

  async updateOrderStatus(orderId, status, paymentStatus) {
    return this.request(`/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, paymentStatus }),
    });
  }
}

export default new ApiService();
