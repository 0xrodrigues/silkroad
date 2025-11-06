import productRepository from '../product.repository.js';
import productValidation from './product.validation.js';

class ProductService {
  /**
   * Create a new product
   */
  async create(data) {

    await productValidation.validate(data);

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
