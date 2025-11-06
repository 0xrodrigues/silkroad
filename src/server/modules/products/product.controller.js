import productService from './service/product.service.js';

class ProductController {
  /**
   * Create a new product
   * POST /api/products
   */
  async create(req, res, next) {
    try {
      const product = await productService.create(req.body);
      res.status(201).json(product);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Find all products
   * GET /api/products?search=...&category=...&currency=...
   */
  async findAll(req, res, next) {
    try {
      const { search, category, currency } = req.query;
      const filters = { search, category, currency };
      
      const products = await productService.findAll(filters);
      res.json(products);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Find product by ID
   * GET /api/products/:id
   */
  async findById(req, res, next) {
    try {
      const product = await productService.findById(req.params.id);
      res.json(product);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Increment view count
   * PATCH /api/products/:id/view
   */
  async incrementView(req, res, next) {
    try {
      const result = await productService.incrementViewCount(req.params.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

export default new ProductController();
