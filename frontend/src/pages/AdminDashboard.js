import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { FaUsers, FaBox, FaClipboardList, FaCog, FaChartBar } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      // For now, we'll construct stats from available endpoints
      const [users, products, orders] = await Promise.all([
        api.get('/users').catch(() => ({ data: { users: [] } })),
        api.get('/products').catch(() => ({ data: { products: [] } })),
        api.get('/orders').catch(() => ({ data: { orders: [] } })),
      ]);

      const totalUsers = users.data.users?.length || 0;
      const totalProducts = products.data.products?.length || 0;
      const totalOrders = orders.data.orders?.length || 0;
      const totalRevenue = (orders.data.orders || []).reduce(
        (sum, order) => sum + (order.totalPrice || 0),
        0
      );

      setStats({
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue,
        activeShopkeepers: users.data.users?.filter((u) => u.role === 'shopkeeper').length || 0,
        totalCustomers: users.data.users?.filter((u) => u.role === 'customer').length || 0,
      });
    } catch (error) {
      console.error('Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-lg text-gray-600">Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage products, users, orders, and platform settings</p>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {/* Total Users */}
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Total Users</h3>
                <div className="bg-blue-100 p-3 rounded-full">
                  <FaUsers className="text-blue-600 text-xl" />
                </div>
              </div>
              <p className="text-4xl font-bold text-gray-900 mb-2">{stats.totalUsers}</p>
              <div className="text-sm text-gray-600 space-y-1">
                <p>👨‍💼 Shopkeepers: {stats.activeShopkeepers}</p>
                <p>👥 Customers: {stats.totalCustomers}</p>
              </div>
            </div>

            {/* Total Products */}
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Total Products</h3>
                <div className="bg-green-100 p-3 rounded-full">
                  <FaBox className="text-green-600 text-xl" />
                </div>
              </div>
              <p className="text-4xl font-bold text-gray-900 mb-2">{stats.totalProducts}</p>
              <p className="text-sm text-gray-600">Active listings across all shopkeepers</p>
            </div>

            {/* Total Orders */}
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Total Orders</h3>
                <div className="bg-purple-100 p-3 rounded-full">
                  <FaClipboardList className="text-purple-600 text-xl" />
                </div>
              </div>
              <p className="text-4xl font-bold text-gray-900 mb-2">{stats.totalOrders}</p>
              <p className="text-sm text-gray-600">Completed and pending orders</p>
            </div>

            {/* Total Revenue */}
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition md:col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Total Revenue</h3>
                <div className="bg-orange-100 p-3 rounded-full">
                  <FaChartBar className="text-orange-600 text-xl" />
                </div>
              </div>
              <p className="text-4xl font-bold text-gray-900 mb-2">₹{stats.totalRevenue.toLocaleString()}</p>
              <p className="text-sm text-gray-600">From all completed orders</p>
            </div>
          </div>
        )}

        {/* Management Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Specifications Management */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
              <div className="flex items-center gap-4 mb-2">
                <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                  <FaCog className="text-2xl" />
                </div>
                <h2 className="text-2xl font-bold">Specifications</h2>
              </div>
              <p className="text-blue-50">Manage category-specific product specifications</p>
            </div>
            <div className="p-6">
              <ul className="space-y-3 mb-6 text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="text-blue-600">✓</span> Create specification templates
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-600">✓</span> Define custom fields per category
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-600">✓</span> Manage dropdown options
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-600">✓</span> Set required fields
                </li>
              </ul>
              <Link
                to="/admin/specifications"
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition text-center block"
              >
                Manage Specifications
              </Link>
            </div>
          </div>

          {/* Users Management */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition">
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-white">
              <div className="flex items-center gap-4 mb-2">
                <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                  <FaUsers className="text-2xl" />
                </div>
                <h2 className="text-2xl font-bold">Users</h2>
              </div>
              <p className="text-green-50">Manage all platform users and roles</p>
            </div>
            <div className="p-6">
              <ul className="space-y-3 mb-6 text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span> View all registered users
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span> View customer & shopkeeper stats
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span> Monitor user activity
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span> Manage user roles
                </li>
              </ul>
              <Link
                to="/admin/users"
                className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition text-center block"
              >
                Manage Users
              </Link>
            </div>
          </div>

          {/* Orders Management */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 text-white">
              <div className="flex items-center gap-4 mb-2">
                <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                  <FaClipboardList className="text-2xl" />
                </div>
                <h2 className="text-2xl font-bold">Orders</h2>
              </div>
              <p className="text-purple-50">Monitor and manage all platform orders</p>
            </div>
            <div className="p-6">
              <ul className="space-y-3 mb-6 text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="text-purple-600">✓</span> View all orders
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-600">✓</span> Track order status
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-600">✓</span> Monitor returns & refunds
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-600">✓</span> View order analytics
                </li>
              </ul>
              <Link
                to="/admin/orders"
                className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition text-center block"
              >
                Manage Orders
              </Link>
            </div>
          </div>

          {/* Products Management */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white">
              <div className="flex items-center gap-4 mb-2">
                <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                  <FaBox className="text-2xl" />
                </div>
                <h2 className="text-2xl font-bold">Products</h2>
              </div>
              <p className="text-orange-50">Monitor and manage all product listings</p>
            </div>
            <div className="p-6">
              <ul className="space-y-3 mb-6 text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="text-orange-600">✓</span> View all products
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-orange-600">✓</span> Monitor inventory levels
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-orange-600">✓</span> Track product reviews
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-orange-600">✓</span> Check product specifications
                </li>
              </ul>
              <Link
                to="/admin/products"
                className="w-full px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition text-center block"
              >
                Manage Products
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-12 bg-blue-50 rounded-lg p-8 border-l-4 border-blue-600">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Need Help?</h3>
          <p className="text-gray-700 mb-4">
            The admin dashboard allows you to manage all aspects of the e-commerce platform. Use the sections above to:
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
            <li>• Define product specifications for each category</li>
            <li>• Monitor user registrations and roles</li>
            <li>• Track orders and revenue</li>
            <li>• Manage product inventory across shopkeepers</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
