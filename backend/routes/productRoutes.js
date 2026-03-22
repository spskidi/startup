const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticate, authorize } = require('../middleware/auth');

// Customer routes
router.get('/', productController.getAllProducts);
router.get('/categories', productController.getCategories);
router.get('/:id', productController.getProductById);

// Shopkeeper routes
router.post('/', authenticate, authorize(['shopkeeper']), productController.createProduct);
router.put('/:id', authenticate, authorize(['shopkeeper']), productController.updateProduct);
router.delete('/:id', authenticate, authorize(['shopkeeper']), productController.deleteProduct);
router.get('/shopkeeper/products/all', authenticate, authorize(['shopkeeper']), productController.getShopkeeperProducts);

module.exports = router;
