import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import { FaStar, FaShoppingCart, FaFilter } from 'react-icons/fa';
import { useCartStore } from '../store/cartStore';
import toast from 'react-hot-toast';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || '');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const { addItem } = useCartStore();

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
    // Update URL params
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (search) params.set('search', search);
    if (sort) params.set('sort', sort);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    setSearchParams(params);
  }, [category, search, sort, minPrice, maxPrice]);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/products/categories');
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Failed to fetch categories');
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (search) params.append('search', search);
      if (sort) params.append('sort', sort);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);

      const response = await api.get(`/products?${params.toString()}`);
      setProducts(response.data.products);
    } catch (error) {
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    if (!product.isListed) {
      toast.error('Product is currently unavailable');
      return;
    }
    addItem({ ...product, quantity: 1 });
    toast.success('Added to cart!');
  };

  const handleClearFilters = () => {
    setCategory('');
    setSearch('');
    setSort('');
    setMinPrice('');
    setMaxPrice('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Shop Products</h1>
          <p className="text-gray-600">
            {products.length > 0 ? `Found ${products.length} products` : 'No products found'}
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div
            className={`lg:block ${showMobileFilters ? 'block' : 'hidden'} lg:sticky lg:top-20 lg:h-fit`}
          >
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6 lg:mb-4">
                <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="lg:hidden text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              {/* Search Filter */}
              <div className="mb-6 pb-6 border-b">
                <label className="block text-sm font-semibold text-gray-900 mb-3">Search</label>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* Category Filter */}
              <div className="mb-6 pb-6 border-b">
                <label className="block text-sm font-semibold text-gray-900 mb-3">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Filter */}
              <div className="mb-6 pb-6 border-b">
                <label className="block text-sm font-semibold text-gray-900 mb-3">Price Range</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="Min"
                    className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  />
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="Max"
                    className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  />
                </div>
              </div>

              {/* Sort Filter */}
              <div className="mb-6 pb-6 border-b">
                <label className="block text-sm font-semibold text-gray-900 mb-3">Sort By</label>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">Latest</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>

              {/* Clear Filters */}
              <button
                onClick={handleClearFilters}
                className="w-full px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition font-medium"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Products Section */}
          <div className="lg:col-span-3">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden mb-6 flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition"
            >
              <FaFilter /> Show Filters
            </button>

            {/* Products Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-lg text-gray-600">Loading products...</div>
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <p className="text-xl text-gray-600 mb-4">No products found</p>
                <button
                  onClick={handleClearFilters}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Clear Filters and Browse All
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {products.map((product) => (
                  <div
                    key={product._id}
                    className={`bg-white rounded-lg overflow-hidden hover:shadow-lg transition transform hover:-translate-y-1 ${
                      !product.isListed ? 'opacity-60' : ''
                    }`}
                  >
                    {/* Product Image */}
                    <Link to={`/product/${product._id}`} className="block overflow-hidden bg-gray-100">
                      <div className="relative aspect-square">
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover hover:scale-110 transition duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            No image
                          </div>
                        )}
                        {product.originalPrice && (
                          <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                            {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                          </div>
                        )}
                      </div>
                    </Link>

                    {/* Product Info */}
                    <div className="p-4">
                      <Link
                        to={`/product/${product._id}`}
                        className="block hover:text-blue-600 transition"
                      >
                        <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 hover:text-blue-600">
                          {product.name}
                        </h3>
                      </Link>

                      {/* Rating */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              size={12}
                              className={
                                i < Math.round(product.rating || 0)
                                  ? 'text-yellow-400'
                                  : 'text-gray-300'
                              }
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600 font-medium">
                          {product.rating || 'No rating'}
                        </span>
                      </div>

                      {/* Price */}
                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-2xl font-bold text-gray-900">₹{product.price}</span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">
                            ₹{product.originalPrice}
                          </span>
                        )}
                      </div>

                      {/* Stock */}
                      <div className="mb-4">
                        {product.isListed ? (
                          <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
                            In Stock ({product.quantity})
                          </span>
                        ) : (
                          <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded">
                            Out of Stock
                          </span>
                        )}
                      </div>

                      {/* Add to Cart Button */}
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={!product.isListed}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FaShoppingCart size={16} /> Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
