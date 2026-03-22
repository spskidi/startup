const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  shopkeeperId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  originalPrice: {
    type: Number,
    default: null,
  },
  quantity: {
    type: Number,
    required: true,
    default: 0,
  },
  images: [{
    type: String,
  }],
  isListed: {
    type: Boolean,
    default: true,
  },
  // Key feature: Product is unlisted if quantity is 10 or less
  minListingQuantity: {
    type: Number,
    default: 10,
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  reviews: [{
    userId: mongoose.Schema.Types.ObjectId,
    rating: Number,
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
  // Product specifications (dynamic based on category)
  specifications: {
    type: Map,
    of: String,
    default: {},
  },
  sku: {
    type: String,
    unique: true,
  },
  tags: [String],
  // Seller information
  sellerName: String,
  warranty: String,
  returnable: {
    type: Boolean,
    default: true,
  },
  returnDays: {
    type: Number,
    default: 30,
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

// Pre-save hook to update isListed based on quantity
productSchema.pre('save', function(next) {
  if (this.quantity <= this.minListingQuantity) {
    this.isListed = false;
  } else {
    this.isListed = true;
  }
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Product', productSchema);
