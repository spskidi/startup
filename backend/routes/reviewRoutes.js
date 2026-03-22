const express = require('express');
const reviewController = require('../controllers/reviewController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/product/:productId', reviewController.getReviews);
router.get('/stats/:productId', reviewController.getReviewStats);

// Protected routes
router.post('/', authenticate, reviewController.addReview);
router.put('/helpful/:reviewId', authenticate, reviewController.markHelpful);
router.delete('/:reviewId', authenticate, reviewController.deleteReview);

module.exports = router;
