const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ customerId: req.user.userId })
      .populate('items.productId');

    if (!cart) {
      return res.json({ items: [], totalAmount: 0 });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch cart', error: error.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity || quantity < 1) {
      return res.status(400).json({ message: 'Invalid product or quantity' });
    }

    const product = await Product.findById(productId);
    if (!product || !product.isListed) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.quantity < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    let cart = await Cart.findOne({ customerId: req.user.userId });

    if (!cart) {
      cart = new Cart({ customerId: req.user.userId, items: [] });
    }

    // Check if product already in cart
    const existingItem = cart.items.find(item => item.productId.toString() === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        productId,
        shopkeeperId: product.shopkeeperId,
        quantity,
        price: product.price,
      });
    }

    // Calculate total
    cart.totalAmount = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cart.updatedAt = Date.now();

    await cart.save();

    res.json({
      message: 'Item added to cart',
      cart,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add to cart', error: error.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;

    const cart = await Cart.findOne({ customerId: req.user.userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => item.productId.toString() !== productId);

    // Recalculate total
    cart.totalAmount = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cart.updatedAt = Date.now();

    if (cart.items.length === 0) {
      await Cart.findByIdAndDelete(cart._id);
      return res.json({ message: 'Item removed from cart', items: [], totalAmount: 0 });
    }

    await cart.save();

    res.json({
      message: 'Item removed from cart',
      cart,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to remove from cart', error: error.message });
  }
};

exports.updateCartQuantity = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity || quantity < 1) {
      return res.status(400).json({ message: 'Invalid product or quantity' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.quantity < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    const cart = await Cart.findOne({ customerId: req.user.userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const item = cart.items.find(item => item.productId.toString() === productId);

    if (item) {
      item.quantity = quantity;
    }

    // Recalculate total
    cart.totalAmount = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cart.updatedAt = Date.now();

    await cart.save();

    res.json({
      message: 'Cart updated',
      cart,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update cart', error: error.message });
  }
};

exports.clearCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({ customerId: req.user.userId });

    res.json({ message: 'Cart cleared', items: [], totalAmount: 0 });
  } catch (error) {
    res.status(500).json({ message: 'Failed to clear cart', error: error.message });
  }
};
