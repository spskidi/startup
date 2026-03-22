const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    shopkeeperId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: Number,
  }],
  totalAmount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Cart', cartSchema);
