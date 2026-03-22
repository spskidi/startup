const Product = require('../models/Product');

exports.getAllProducts = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, search, sort } = req.query;

    let query = { isListed: true }; // Only show listed products

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let sortOption = { createdAt: -1 }; // Default sort
    if (sort) {
      if (sort === 'price-asc') sortOption = { price: 1 };
      if (sort === 'price-desc') sortOption = { price: -1 };
      if (sort === 'rating') sortOption = { rating: -1 };
    }

    const products = await Product.find(query)
      .sort(sortOption)
      .populate('shopkeeperId', 'shopName')
      .limit(50);

    res.json({
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products', error: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('shopkeeperId', 'shopName shopDescription address');

    if (!product || !product.isListed) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch product', error: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, description, category, price, originalPrice, quantity, images, sku, tags, specifications, warranty, returnable, returnDays } = req.body;

    if (!name || !description || !category || !price || quantity === undefined) {
      return res.status(400).json({ message: 'Required fields missing' });
    }

    const product = new Product({
      shopkeeperId: req.user.userId,
      name,
      description,
      category,
      price,
      originalPrice,
      quantity,
      images: images || [],
      sku: sku || `SKU-${Date.now()}`,
      tags: tags || [],
      specifications: specifications || {},
      sellerName: req.user.name,
      warranty: warranty || '1 Year Warranty',
      returnable: returnable !== undefined ? returnable : true,
      returnDays: returnDays || 30,
    });

    await product.save();

    res.status(201).json({
      message: 'Product created successfully',
      product,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create product', error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Authorization: Only shopkeeper who created product can update it
    if (product.shopkeeperId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const { name, description, category, price, originalPrice, quantity, images, tags, specifications, warranty, returnable, returnDays } = req.body;

    if (name) product.name = name;
    if (description) product.description = description;
    if (category) product.category = category;
    if (price !== undefined) product.price = price;
    if (originalPrice !== undefined) product.originalPrice = originalPrice;
    if (quantity !== undefined) product.quantity = quantity;
    if (images) product.images = images;
    if (tags) product.tags = tags;
    if (specifications) product.specifications = specifications;
    if (warranty) product.warranty = warranty;
    if (returnable !== undefined) product.returnable = returnable;
    if (returnDays) product.returnDays = returnDays;

    product.updatedAt = Date.now();
    await product.save();

    res.json({
      message: 'Product updated successfully',
      product,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update product', error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.shopkeeperId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete product', error: error.message });
  }
};

exports.getShopkeeperProducts = async (req, res) => {
  try {
    const products = await Product.find({ shopkeeperId: req.user.userId });
    res.json({
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products', error: error.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category', { isListed: true });
    res.json({ categories: categories.sort() });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch categories', error: error.message });
  }
};
