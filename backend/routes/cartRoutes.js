const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, cartController.getCart);
router.post('/add', authenticate, cartController.addToCart);
router.post('/remove', authenticate, cartController.removeFromCart);
router.post('/update-quantity', authenticate, cartController.updateCartQuantity);
router.delete('/clear', authenticate, cartController.clearCart);

module.exports = router;
