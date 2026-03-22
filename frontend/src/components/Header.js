import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { FiShoppingCart, FiLogOut, FiMenuProto } from 'react-icons/fi';
import { FiUser } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import { useState } from 'react';

export default function Header() {
  const { user, logout } = useAuthStore();
  const { getItemCount } = useCartStore();
  const { wishlist } = useWishlistStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600 font-sans">
          EcommercePro
        </Link>

        <nav className="hidden md:flex space-x-6">
          <Link to="/" className="text-gray-700 hover:text-blue-600 transition font-medium">
            Home
          </Link>
          <Link to="/products" className="text-gray-700 hover:text-blue-600 transition font-medium">
            Shop
          </Link>
          {user && (Array.isArray(user.roles) ? user.roles : [user.role])?.includes('shopkeeper') && (
            <Link to="/shopkeeper/dashboard" className="text-gray-700 hover:text-blue-600 transition font-medium">
              Dashboard
            </Link>
          )}
        </nav>

        <div className="flex items-center space-x-6">
          {!user ? (
            <>
              <Link to="/login" className="px-4 py-2 text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition font-medium">
                Login
              </Link>
              <Link to="/register" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
                Join
              </Link>
            </>
          ) : (
            <>
              {user.role === 'customer' && (
                <>
                  <Link to="/wishlist" className="relative group">
                    <FaHeart className="text-2xl text-gray-700 group-hover:text-red-500 transition" />
                    {wishlist.length > 0 && (
                      <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                        {wishlist.length}
                      </span>
                    )}
                  </Link>
                  <Link to="/cart" className="relative group">
                    <FiShoppingCart className="text-2xl text-gray-700 group-hover:text-blue-600 transition" />
                    {getItemCount() > 0 && (
                      <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                        {getItemCount()}
                      </span>
                    )}
                  </Link>
                </>
              )}

              <div className="flex items-center space-x-2 border-l pl-6">
                <FiUser className="text-gray-700 text-lg" />
                <span className="text-sm font-medium text-gray-800">{user.name}</span>
              </div>

              <button
                onClick={logout}
                className="text-red-600 hover:text-red-800 transition font-medium flex items-center space-x-1"
              >
                <FiLogOut />
                <span>Logout</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
