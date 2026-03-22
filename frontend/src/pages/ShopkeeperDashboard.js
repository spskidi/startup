import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';

export default function ShopkeeperDashboard() {
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    originalPrice: '',
    quantity: '',
    images: [],
    sku: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, statsRes] = await Promise.all([
        api.get('/products/shopkeeper/products/all'),
        api.get('/shopkeeper/dashboard/stats'),
      ]);
      setProducts(productsRes.data.products);
      setStats(statsRes.data);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, formData);
        toast.success('Product updated successfully');
      } else {
        await api.post('/products', formData);
        toast.success('Product created successfully');
      }
      setFormData({
        name: '',
        description: '',
        category: '',
        price: '',
        originalPrice: '',
        quantity: '',
        images: [],
        sku: '',
      });
      setShowForm(false);
      setEditingId(null);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save product');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await api.delete(`/products/${id}`);
        toast.success('Product deleted');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  const handleEdit = (product) => {
    setFormData(product);
    setEditingId(product._id);
    setShowForm(true);
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopkeeper Dashboard</h1>

      {/* Stats */}
      {stats && (
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="border rounded-lg p-6 bg-blue-50">
            <p className="text-gray-600">Total Products</p>
            <p className="text-3xl font-bold">{stats.totalProducts}</p>
          </div>
          <div className="border rounded-lg p-6 bg-green-50">
            <p className="text-gray-600">Listed Products</p>
            <p className="text-3xl font-bold text-green-600">{stats.listedProducts}</p>
          </div>
          <div className="border rounded-lg p-6 bg-red-50">
            <p className="text-gray-600">Unlisted Products</p>
            <p className="text-3xl font-bold text-red-600">{stats.unlistedProducts}</p>
          </div>
          <div className="border rounded-lg p-6 bg-purple-50">
            <p className="text-gray-600">Total Inventory Value</p>
            <p className="text-3xl font-bold text-purple-600">₹{stats.totalValue}</p>
          </div>
        </div>
      )}

      {/* Add Product Button */}
      <div className="mb-8">
        <Link
          to="/shopkeeper/add-product"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          <FiPlus /> Add New Product
        </Link>
      </div>

      {/* Form - Removed, use ShopkeeperAddProductPage instead */}

      {/* Products Table */}
      <div className="border rounded-lg overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left font-semibold">Name</th>
              <th className="px-6 py-3 text-left font-semibold">Category</th>
              <th className="px-6 py-3 text-left font-semibold">Price</th>
              <th className="px-6 py-3 text-left font-semibold">Quantity</th>
              <th className="px-6 py-3 text-left font-semibold">Status</th>
              <th className="px-6 py-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  No products yet
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product._id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{product.name}</td>
                  <td className="px-6 py-4">{product.category}</td>
                  <td className="px-6 py-4">₹{product.price}</td>
                  <td className="px-6 py-4">
                    <span className={product.quantity > 10 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                      {product.quantity}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded text-sm font-semibold ${
                        product.isListed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {product.isListed ? 'Listed' : 'Unlisted'}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      <FiEdit2 /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="text-red-600 hover:text-red-800 flex items-center gap-1"
                    >
                      <FiTrash2 /> Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
