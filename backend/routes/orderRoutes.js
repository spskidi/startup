const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticate, authorize } = require('../middleware/auth');

router.post('/', authenticate, authorize(['customer']), orderController.createOrder);
router.get('/:id', authenticate, orderController.getOrder);
router.get('/', authenticate, authorize(['customer']), orderController.getCustomerOrders);
router.put('/:id/status', authenticate, authorize(['shopkeeper']), orderController.updateOrderStatus);
router.post('/:id/cancel', authenticate, authorize(['customer']), orderController.cancelOrder);

// Shopkeeper specific
router.get('/shopkeeper/all/orders', authenticate, authorize(['shopkeeper']), orderController.getShopkeeperOrders);

module.exports = router;
