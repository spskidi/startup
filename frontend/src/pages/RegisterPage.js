import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [role, setRole] = useState('customer');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    shopName: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/auth/register', {
        ...formData,
        role,
      });
      login(response.data.user, response.data.token);
      toast.success('Registration successful!');
      navigate(role === 'shopkeeper' ? '/shopkeeper/dashboard' : '/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6">Register</h2>

        <div className="flex gap-4 mb-6">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              value="customer"
              checked={role === 'customer'}
              onChange={(e) => setRole(e.target.value)}
              className="mr-2"
            />
            <span>Customer</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              value="shopkeeper"
              checked={role === 'shopkeeper'}
              onChange={(e) => setRole(e.target.value)}
              className="mr-2"
            />
            <span>Shopkeeper</span>
          </label>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          {role === 'shopkeeper' && (
            <div>
              <label className="block text-sm font-medium mb-1">Shop Name</label>
              <input
                type="text"
                name="shopName"
                value={formData.shopName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                required={role === 'shopkeeper'}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-2 rounded font-semibold hover:bg-opacity-90 transition disabled:opacity-50"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="text-center mt-4">
          Already have an account?{' '}
          <a href="/login" className="text-primary font-semibold hover:underline">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
}
