import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaHeart, FaStar, FaArrowRight } from 'react-icons/fa';
import { FiTrendingUp, FiShoppingBag, FiUsers, FiAward, FiTruck, FiShield } from 'react-icons/fi';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedData();
  }, []);

  const fetchFeaturedData = async () => {
    try {
      setLoading(true);
      const [productsRes, categoriesRes] = await Promise.all([
        api.get('/products?sort=rating&limit=6'),
        api.get('/products/categories'),
      ]);
      setFeaturedProducts(productsRes.data.products || []);
      setCategories(categoriesRes.data.categories || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-pattern"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Shop Everything You Need
              </h1>
              <p className="text-xl md:text-2xl mb-4 text-blue-100">
                Discover millions of products from trusted sellers. Best prices guaranteed.
              </p>
              <p className="text-lg mb-8 text-blue-100">
                Authentic • Affordable • Accessible
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition transform hover:scale-105 gap-2"
                >
                  Shop Now <FaArrowRight />
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-blue-600 transition"
                >
                  Sell with Us
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="bg-white bg-opacity-10 rounded-2xl p-8 backdrop-blur-sm border border-white border-opacity-20">
                <div className="space-y-4 text-blue-100">
                  <div className="flex items-center gap-3">
                    <FiTruck className="text-3xl" />
                    <span className="text-lg">Free Shipping on Orders ₹500+</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FiShield className="text-3xl" />
                    <span className="text-lg">100% Secure Checkout</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaHeart className="text-3xl" />
                    <span className="text-lg">Easy Returns & Exchanges</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.slice(0, 6).map((category, index) => (
              <Link
                key={index}
                to={`/products?category=${category}`}
                className="group bg-white rounded-lg p-6 text-center hover:shadow-lg transition transform hover:-translate-y-1"
              >
                <div className="mb-3 text-4xl">
                  {['🖥️', '📱', '👔', '📚', '⚽', '🏠'][index % 6]}
                </div>
                <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition capitalize line-clamp-2">
                  {category}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why Shop with Us?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group text-center p-8 bg-white rounded-lg hover:shadow-lg transition">
              <div className="text-5xl text-blue-600 mb-4 group-hover:scale-110 transition">
                <FiShoppingBag />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Vast Selection</h3>
              <p className="text-gray-600">
                Browse millions of products across all categories from thousands of verified sellers.
              </p>
            </div>
            <div className="group text-center p-8 bg-white rounded-lg hover:shadow-lg transition">
              <div className="text-5xl text-green-600 mb-4 group-hover:scale-110 transition">
                <FiTrendingUp />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Unbeatable Prices</h3>
              <p className="text-gray-600">
                Competitive pricing with daily deals and exclusive discounts. Price match guaranteed.
              </p>
            </div>
            <div className="group text-center p-8 bg-white rounded-lg hover:shadow-lg transition">
              <div className="text-5xl text-purple-600 mb-4 group-hover:scale-110 transition">
                <FiAward />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Trusted & Secure</h3>
              <p className="text-gray-600">
                100% secure payments, verified sellers, and buyer protection on every purchase.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      {
        featuredProducts.length > 0 && (
          <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex items-center justify-between mb-12">
                <h2 className="text-3xl font-bold text-gray-900">Top Rated Products</h2>
                <Link 
                  to="/products?sort=rating" 
                  className="text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-2"
                >
                  View All <FaArrowRight size={14} />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredProducts.map((product) => (
                  <Link
                    key={product._id}
                    to={`/product/${product._id}`}
                    className="group bg-white rounded-lg overflow-hidden hover:shadow-lg transition"
                  >
                    <div className="aspect-square bg-gray-200 overflow-hidden relative">
                      {product.images?.[0] && (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                        />
                      )}
                      {product.originalPrice && (
                        <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                          {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 line-clamp-2 mb-2">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-2 mb-3">
                        <FaStar className="text-yellow-400" size={14} />
                        <span className="text-sm font-semibold text-gray-700">
                          {product.rating || 'No ratings'}
                        </span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-gray-900">₹{product.price}</span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )
      }

      {/* CTA Banner */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-4">Become a Seller Today</h2>
              <p className="text-lg text-orange-100 mb-6">
                Join thousands of successful sellers. Register for free and start selling in minutes.
              </p>
              <Link
                to="/register"
                className="inline-block px-8 py-3 bg-white text-red-600 font-bold rounded-lg hover:bg-orange-50 transition"
              >
                Start Selling
              </Link>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-8 backdrop-blur-sm">
              <ul className="space-y-3 text-orange-100">
                <li className="flex items-center gap-2">
                  ✓ Fast registration
                </li>
                <li className="flex items-center gap-2">
                  ✓ Low commission rates
                </li>
                <li className="flex items-center gap-2">
                  ✓ Marketing support
                </li>
                <li className="flex items-center gap-2">
                  ✓ 24/7 seller assistance
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
