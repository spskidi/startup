import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const response = await api.get(`/orders/${id}`);
      setOrder(response.data);
    } catch (error) {
      toast.error('Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await api.post(`/orders/${id}/cancel`);
        toast.success('Order cancelled');
        fetchOrder();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to cancel order');
      }
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (!order) return <div className="text-center py-12">Order not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/" className="text-primary hover:underline mb-4 inline-block">
        Back to Home
      </Link>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="border rounded-lg p-6 mb-6">
            <h1 className="text-3xl font-bold mb-4">Order Details</h1>
            <div className="space-y-2">
              <p><strong>Order Number:</strong> {order.orderNumber}</p>
              <p><strong>Order Status:</strong> <span className="font-semibold text-blue-600">{order.orderStatus}</span></p>
              <p><strong>Payment Status:</strong> <span className="font-semibold">{order.paymentStatus}</span></p>
              <p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="border rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Items</h2>
            {order.items.map((item) => (
              <div key={item._id} className="flex justify-between pb-4 border-b last:border-b-0">
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-gray-600">Quantity: {item.quantity}</p>
                </div>
                <p className="font-semibold">₹{item.totalPrice}</p>
              </div>
            ))}
          </div>

          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
            <div className="text-gray-700">
              <p className="font-semibold">{order.shippingAddress.name}</p>
              <p>{order.shippingAddress.street}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
              <p>{order.shippingAddress.country}</p>
              <p className="mt-2"><strong>Phone:</strong> {order.shippingAddress.phone}</p>
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-6 h-fit">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{order.totalAmount}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>₹{order.tax || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="text-green-600">Free</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-primary">₹{order.totalAmount + (order.tax || 0)}</span>
            </div>
          </div>

          <div className="text-sm text-gray-600 mb-4">
            <p><strong>Payment Method:</strong> {order.paymentMethod || 'N/A'}</p>
          </div>

          {['pending', 'confirmed', 'processing'].includes(order.orderStatus) && (
            <button
              onClick={handleCancelOrder}
              className="w-full border border-red-600 text-red-600 py-2 rounded font-semibold hover:bg-red-50 transition"
            >
              Cancel Order
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
