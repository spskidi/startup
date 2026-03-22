import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import { FaStar, FaHeart, FaShoppingCart } from 'react-icons/fa';
import { FaRegHeart } from 'react-icons/fa';
import ReviewsSection from '../components/ReviewsSection';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCartStore();
  const { isInWishlist, toggleWishlist } = useWishlistStore();
  const { isLoggedIn } = useAuthStore();

  useEffect(() => {
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      toast.error('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product.isListed) {
      toast.error('This product is currently unavailable');
      return;
    }
    if (quantity > product.quantity) {
      toast.error('Insufficient stock');
      return;
    }
    addItem({ ...product, quantity });
    toast.success(`${quantity} item(s) added to cart!`);
  };

  const handleToggleWishlist = async () => {
    if (!isLoggedIn) {
      toast.error('Please login to add to wishlist');
      navigate('/login');
      return;
    }
    const result = await toggleWishlist(id);
    if (result.success) {
      toast.success(isInWishlist(id) ? 'Removed from wishlist' : 'Added to wishlist');
    } else {
      toast.error(result.error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">Product not found</p>
      </div>
    );
  }

  const inWishlist = isInWishlist(id);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Product Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Image */}
            <div className="flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden min-h-[400px]">
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-center text-gray-500">No image available</div>
              )}
            </div>

            {/* Details */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={i < Math.round(product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'} />
                  ))}
                </div>
                <span className="text-gray-700 font-semibold">{product.rating || 0}</span>
              </div>

              {/* Category & Seller */}
              <div className="mb-4 pb-4 border-b">
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-semibold">Category:</span> {product.category}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Seller:</span> {product.sellerName || product.shopkeeperId?.shopName}
                </p>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-4xl font-bold text-gray-900">₹{product.price}</span>
                  {product.originalPrice && (
                    <>
                      <span className="text-lg text-gray-500 line-through">₹{product.originalPrice}</span>
                      <span className="text-lg font-bold text-green-600">{discount}% off</span>
                    </>
                  )}
                </div>
                <p className="text-sm text-gray-600">Inclusive of all taxes</p>
              </div>

              {/* Stock Status */}
              <div className={`p-3 rounded-lg mb-6 ${product.isListed ? 'bg-green-50' : 'bg-red-50'}`}>
                {product.isListed ? (
                  <p className="text-green-700 font-semibold">✓ In Stock ({product.quantity} available)</p>
                ) : (
                  <p className="text-red-700 font-semibold">✗ Out of Stock</p>
                )}
              </div>

              {/* Warranty & Returns */}
              <div className="bg-blue-50 p-4 rounded-lg mb-6 space-y-2">
                <p className="text-sm">
                  <span className="font-semibold">Warranty:</span> {product.warranty}
                </p>
                {product.returnable && (
                  <p className="text-sm">
                    <span className="font-semibold">Returns:</span> {product.returnDays} days return policy
                  </p>
                )}
              </div>

              {/* Quantity & Action Buttons */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition"
                    >
                      −
                    </button>
                    <span className="px-6 py-2 font-semibold text-gray-900">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                      disabled={quantity >= product.quantity}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={!product.isListed}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <FaShoppingCart /> Add to Cart
                  </button>
                  <button
                    onClick={handleToggleWishlist}
                    className={`px-6 py-3 border-2 rounded-lg font-bold transition ${
                      inWishlist
                        ? 'bg-red-50 border-red-600 text-red-600 hover:bg-red-100'
                        : 'border-gray-400 text-gray-600 hover:border-red-600 hover:text-red-600'
                    }`}
                  >
                    {inWishlist ? <FaHeart /> : <FaRegHeart />}
                  </button>
                </div>
              </div>

              {/* Important Info */}
              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-900">
                <p className="font-semibold mb-2">📦 Free Shipping on Orders Above ₹500</p>
                <p>Delivery within 3-5 business days</p>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications Section */}
        {product.specifications && Object.keys(product.specifications).length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Specifications</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex items-start gap-4 pb-4 border-b border-gray-100">
                  <span className="font-semibold text-gray-700 min-w-[150px]">{key}:</span>
                  <span className="text-gray-600">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Description Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{product.description}</p>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <ReviewsSection productId={id} />
        </div>
      </div>
    </div>
  );
}
