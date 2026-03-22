const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

// Get user's wishlist
exports.getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    let wishlist = await Wishlist.findOne({ customerId: userId })
      .populate('items.productId');

    if (!wishlist) {
      wishlist = new Wishlist({ customerId: userId, items: [] });
      await wishlist.save();
    }

    res.status(200).json({
      success: true,
      wishlist: wishlist.items,
      count: wishlist.items.length,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching wishlist', error: error.message });
  }
};

// Add product to wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let wishlist = await Wishlist.findOne({ customerId: userId });
    if (!wishlist) {
      wishlist = new Wishlist({ customerId: userId, items: [{ productId }] });
    } else {
      // Check if product already in wishlist
      const exists = wishlist.items.some(item => item.productId.toString() === productId);
      if (exists) {
        return res.status(400).json({ message: 'Product already in wishlist' });
      }
      wishlist.items.push({ productId });
    }

    await wishlist.save();
    res.status(201).json({
      success: true,
      message: 'Product added to wishlist',
      wishlist: wishlist.items,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error adding to wishlist', error: error.message });
  }
};

// Remove product from wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    const wishlist = await Wishlist.findOne({ customerId: userId });
    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    wishlist.items = wishlist.items.filter(item => item.productId.toString() !== productId);
    await wishlist.save();

    res.status(200).json({
      success: true,
      message: 'Product removed from wishlist',
      wishlist: wishlist.items,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error removing from wishlist', error: error.message });
  }
};

// Check if product is in wishlist
exports.isInWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    const wishlist = await Wishlist.findOne({ customerId: userId });
    if (!wishlist) {
      return res.status(200).json({ inWishlist: false });
    }

    const found = wishlist.items.some(item => item.productId.toString() === productId);
    res.status(200).json({ inWishlist: found });
  } catch (error) {
    res.status(500).json({ message: 'Error checking wishlist', error: error.message });
  }
};

// Clear entire wishlist
exports.clearWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    await Wishlist.findOneAndUpdate({ customerId: userId }, { items: [] });

    res.status(200).json({
      success: true,
      message: 'Wishlist cleared',
    });
  } catch (error) {
    res.status(500).json({ message: 'Error clearing wishlist', error: error.message });
  }
};
