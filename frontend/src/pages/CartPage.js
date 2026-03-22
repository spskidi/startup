import React from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { FiTrash2 } from 'react-icons/fi';

export default function CartPage() {
  const { items, totalAmount, removeItem, updateQuantity, clearCart } = useCartStore();
  const { isLoggedIn } = useAuthStore();

  if (!isLoggedIn) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-lg mb-4">Please login to view your cart</p>
        <Link to="/login" className="text-primary font-semibold hover:underline">
          Login here
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-lg mb-4">Your cart is empty</p>
        <Link to="/products" className="text-primary font-semibold hover:underline">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {items.map((item) => (
            <div key={item._id} className="flex gap-4 border rounded-lg p-4 mb-4">
              {item.images && item.images.length > 0 ? (
                <img src={item.images[0]} alt={item.name} className="w-24 h-24 object-cover rounded" />
              ) : (
                <div className="w-24 h-24 bg-gray-200 rounded flex items-center justify-center">
                  <span className="text-xs text-gray-500">No image</span>
                </div>
              )}

              <div className="flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-gray-600">₹{item.price}</p>

                <div className="flex items-center gap-2 mt-2 border w-fit rounded">
                  <button
                    onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="px-4 py-1">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="text-right">
                <p className="font-semibold">₹{item.price * item.quantity}</p>
                <button
                  onClick={() => removeItem(item._id)}
                  className="text-red-600 hover:text-red-800 mt-2 flex items-center gap-1"
                >
                  <FiTrash2 /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="border rounded-lg p-6 h-fit">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span>Items: {items.length}</span>
              <span>₹{totalAmount}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-bold">
              <span>Total</span>
              <span>₹{totalAmount}</span>
            </div>
          </div>

          <Link
            to="/checkout"
            className="block w-full bg-primary text-white py-3 rounded font-semibold text-center hover:bg-opacity-90 transition mb-2"
          >
            Proceed to Checkout
          </Link>

          <button
            onClick={clearCart}
            className="w-full border border-red-600 text-red-600 py-2 rounded font-semibold hover:bg-red-50 transition"
          >
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
}
