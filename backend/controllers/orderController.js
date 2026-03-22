const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');

exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0 || !shippingAddress) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    let totalAmount = 0;
    const orderItems = [];

    // Validate and prepare items
    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product || product.quantity < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product?.name || 'product'}`,
        });
      }

      // Reduce product quantity
      product.quantity -= item.quantity;
      await product.save();

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        totalPrice: itemTotal,
      });
    }

    // Create order
    const order = new Order({
      customerId: req.user.userId,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod: paymentMethod || 'card',
    });

    // Handle shopkeeper - for simplicity, use first shopkeeper
    if (items[0]) {
      const product = await Product.findById(items[0].productId);
      order.shopkeeperId = product.shopkeeperId;
    }

    await order.save();

    // Clear cart
    await Cart.findOneAndDelete({ customerId: req.user.userId });

    res.status(201).json({
      message: 'Order created successfully',
      order,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create order', error: error.message });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.productId')
      .populate('shopkeeperId', 'shopName phone email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check authorization
    if (order.customerId.toString() !== req.user.userId && order.shopkeeperId._id.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch order', error: error.message });
  }
};

exports.getCustomerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customerId: req.user.userId })
      .sort({ createdAt: -1 })
      .populate('items.productId')
      .populate('shopkeeperId', 'shopName');

    res.json({ count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
};

exports.getShopkeeperOrders = async (req, res) => {
  try {
    const orders = await Order.find({ shopkeeperId: req.user.userId })
      .sort({ createdAt: -1 })
      .populate('items.productId')
      .populate('customerId', 'name email phone');

    res.json({ count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.shopkeeperId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    order.orderStatus = orderStatus;
    order.updatedAt = Date.now();

    await order.save();

    res.json({ message: 'Order status updated', order });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update order', error: error.message });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.customerId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (['shipped', 'delivered', 'cancelled'].includes(order.orderStatus)) {
      return res.status(400).json({ message: `Cannot cancel order with status: ${order.orderStatus}` });
    }

    // Restore product quantities
    for (const item of order.items) {
      const product = await Product.findById(item.productId);
      if (product) {
        product.quantity += item.quantity;
        await product.save();
      }
    }

    order.orderStatus = 'cancelled';
    order.updatedAt = Date.now();

    await order.save();

    res.json({ message: 'Order cancelled successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Failed to cancel order', error: error.message });
  }
};
