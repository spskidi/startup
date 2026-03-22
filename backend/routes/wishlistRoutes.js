const express = require('express');
const wishlistController = require('../controllers/wishlistController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Wishlist routes (all protected)
router.get('/', authenticate, wishlistController.getWishlist);
router.post('/add', authenticate, wishlistController.addToWishlist);
router.post('/remove', authenticate, wishlistController.removeFromWishlist);
router.get('/check/:productId', authenticate, wishlistController.isInWishlist);
router.delete('/clear', authenticate, wishlistController.clearWishlist);

module.exports = router;
