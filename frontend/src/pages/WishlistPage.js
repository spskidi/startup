import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaTrash, FaArrowRight, FaHeart } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useWishlistStore } from '../store/wishlistStore';
import { useAuthStore } from '../store/authStore';

export default function WishlistPage() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthStore();
  const { wishlist, isLoading, fetchWishlist, removeFromWishlist } = useWishlistStore();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    fetchWishlist();
  }, [isLoggedIn, navigate]);

  const handleRemove = async (productId) => {
    const result = await removeFromWishlist(productId);
    if (result.success) {
      toast.success('Removed from wishlist');
    } else {
      toast.error(result.error || 'Failed to remove from wishlist');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading wishlist...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Wishlist</h1>
          <p className="text-gray-600">You have {wishlist.length} item(s) in your wishlist</p>
        </div>

        {wishlist.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <FaHeart className="mx-auto text-4xl text-gray-300 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-6">Start exploring products and add them to your wishlist!</p>
            <Link
              to="/products"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Continue Shopping <FaArrowRight className="ml-2" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((item) => (
              <div key={item.productId?._id} className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
                <div className="aspect-square bg-gray-200 overflow-hidden">
                  {item.productId?.images?.[0] && (
                    <img
                      src={item.productId.images[0]}
                      alt={item.productId.name}
                      className="w-full h-full object-cover hover:scale-105 transition"
                    />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">
                    {item.productId?.name}
                  </h3>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-2xl font-bold text-gray-900">
                        ₹{item.productId?.price}
                      </span>
                      {item.productId?.originalPrice && (
                        <span className="text-gray-500 line-through ml-2">
                          ₹{item.productId.originalPrice}
                        </span>
                      )}
                    </div>
                    {item.productId?.rating && (
                      <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                        ⭐ {item.productId.rating}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Link
                      to={`/product/${item.productId?._id}`}
                      className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition text-center font-medium"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => handleRemove(item.productId?._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                      title="Remove from wishlist"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
