import express from 'express';
import orderController from './order.controller.js';

const router = express.Router();

// Order routes
router.post('/', (req, res, next) => orderController.create(req, res, next));
router.get('/buyer/:buyerId', (req, res, next) => orderController.listByBuyer(req, res, next));
router.get('/seller/:sellerId', (req, res, next) => orderController.listBySeller(req, res, next));
router.put('/:orderId/status', (req, res, next) => orderController.updateStatus(req, res, next));

export default router;
