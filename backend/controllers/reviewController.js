const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');

// Add review for product
exports.addReview = async (req, res) => {
  try {
    const { productId, rating, title, comment, images } = req.body;
    const userId = req.user.id;

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user has purchased this product
    const order = await Order.findOne({
      customerId: userId,
      'items.productId': productId,
      orderStatus: { $in: ['delivered', 'completed'] },
    });

    const isVerifiedPurchase = !!order;

    // Create review
    const review = new Review({
      productId,
      userId,
      userName: req.user.name,
      rating,
      title,
      comment,
      isVerifiedPurchase,
      images: images || [],
    });

    await review.save();

    // Update product rating
    const allReviews = await Review.find({ productId });
    const avgRating =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    
    product.rating = Math.round(avgRating * 10) / 10;
    await product.save();

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      review,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error adding review', error: error.message });
  }
};

// Get reviews for product
exports.getReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10, sortBy = 'recent' } = req.query;

    let sort = { createdAt: -1 };
    if (sortBy === 'helpful') {
      sort = { helpfulCount: -1, createdAt: -1 };
    } else if (sortBy === 'rating-high') {
      sort = { rating: -1 };
    } else if (sortBy === 'rating-low') {
      sort = { rating: 1 };
    }

    const skip = (page - 1) * limit;
    const reviews = await Review.find({ productId })
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('userId', 'name');

    const total = await Review.countDocuments({ productId });

    res.status(200).json({
      success: true,
      reviews,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        count: reviews.length,
        totalReviews: total,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews', error: error.message });
  }
};

// Mark review as helpful
exports.markHelpful = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findByIdAndUpdate(
      reviewId,
      { $inc: { helpfulCount: 1 } },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Review marked as helpful',
      review,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error marking review', error: error.message });
  }
};

// Delete review (owner or admin)
exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.userId.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    await Review.findByIdAndDelete(reviewId);

    // Update product rating
    const allReviews = await Review.find({ productId: review.productId });
    if (allReviews.length > 0) {
      const avgRating =
        allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
      const product = await Product.findById(review.productId);
      product.rating = Math.round(avgRating * 10) / 10;
      await product.save();
    }

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting review', error: error.message });
  }
};

// Get review stats for product
exports.getReviewStats = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ productId });
    const stats = {
      total: reviews.length,
      average: 0,
      distribution: {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0,
      },
      verifiedPurchases: 0,
    };

    reviews.forEach(review => {
      stats.distribution[review.rating]++;
      if (review.isVerifiedPurchase) stats.verifiedPurchases++;
    });

    if (stats.total > 0) {
      stats.average =
        reviews.reduce((sum, r) => sum + r.rating, 0) / stats.total;
      stats.average = Math.round(stats.average * 10) / 10;

      stats.distribution[5] = ((stats.distribution[5] / stats.total) * 100).toFixed(1);
      stats.distribution[4] = ((stats.distribution[4] / stats.total) * 100).toFixed(1);
      stats.distribution[3] = ((stats.distribution[3] / stats.total) * 100).toFixed(1);
      stats.distribution[2] = ((stats.distribution[2] / stats.total) * 100).toFixed(1);
      stats.distribution[1] = ((stats.distribution[1] / stats.total) * 100).toFixed(1);
    }

    res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching review stats', error: error.message });
  }
};
