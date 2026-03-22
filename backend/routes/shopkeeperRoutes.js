const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const Product = require('../models/Product');

// Get shopkeeper dashboard stats
router.get('/dashboard/stats', authenticate, authorize(['shopkeeper']), async (req, res) => {
  try {
    const products = await Product.find({ shopkeeperId: req.user.userId });
    const totalProducts = products.length;
    const listedProducts = products.filter(p => p.isListed).length;
    const totalQuantity = products.reduce((sum, p) => sum + p.quantity, 0);
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);

    res.json({
      totalProducts,
      listedProducts,
      unlistedProducts: totalProducts - listedProducts,
      totalQuantity,
      totalValue,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch stats', error: error.message });
  }
});

module.exports = router;
