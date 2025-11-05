import productRepository from './product.repository.js';

class ProductService {
  /**
   * Create a new product
   */
  async create(data) {
    // Validate required fields
    if (!data.title || !data.description || !data.price) {
      throw new Error('Title, description, and price are required');
    }

    if (!data.sellerId) {
      throw new Error('Seller ID is required');
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(data.sellerId)) {
      throw new Error('Seller ID must be a valid UUID');
    }

    if (data.price <= 0) {
      throw new Error('Price must be greater than 0');
    }

    // Convert currency code to integer if provided
    if (data.currency) {
      data.currency = productRepository.getCurrencyInt(data.currency);
    }

    return await productRepository.create(data);
  }

  /**
   * Find all products with filters
   */
  async findAll(filters) {
    return await productRepository.findAll(filters);
  }

  /**
   * Find product by ID
   */
  async findById(id) {
    const product = await productRepository.findById(id);
    
    if (!product) {
      throw new Error('Product not found');
    }

    return product;
  }

  /**
   * Increment view count
   */
  async incrementViewCount(id) {
    // First check if product exists
    const product = await productRepository.findById(id);
    
    if (!product) {
      throw new Error('Product not found');
    }

    return await productRepository.incrementViewCount(id);
  }
}

export default new ProductService();
