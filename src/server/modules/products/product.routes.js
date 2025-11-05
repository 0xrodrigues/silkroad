import express from 'express';
import productController from './product.controller.js';

const router = express.Router();

// Product routes
router.post('/', (req, res, next) => productController.create(req, res, next));
router.get('/', (req, res, next) => productController.findAll(req, res, next));
router.get('/:id', (req, res, next) => productController.findById(req, res, next));
router.patch('/:id/view', (req, res, next) => productController.incrementView(req, res, next));

export default router;
