import { create } from 'zustand';
import axios from 'axios';

const apiBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const useWishlistStore = create((set, get) => ({
  wishlist: [],
  isLoading: false,

  // Fetch wishlist
  fetchWishlist: async () => {
    set({ isLoading: true });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${apiBaseUrl}/wishlist`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ wishlist: response.data.wishlist || [] });
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
    set({ isLoading: false });
  },

  // Add to wishlist
  addToWishlist: async (productId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${apiBaseUrl}/wishlist/add`,
        { productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      set({ wishlist: response.data.wishlist });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },

  // Remove from wishlist
  removeFromWishlist: async (productId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${apiBaseUrl}/wishlist/remove`,
        { productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      set({ wishlist: response.data.wishlist });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },

  // Check if product in wishlist
  isInWishlist: (productId) => {
    const { wishlist } = get();
    return wishlist.some(item => item.productId?._id === productId || item.productId === productId);
  },

  // Toggle wishlist
  toggleWishlist: async (productId) => {
    const { isInWishlist, addToWishlist, removeFromWishlist } = get();
    if (isInWishlist(productId)) {
      return removeFromWishlist(productId);
    } else {
      return addToWishlist(productId);
    }
  },

  // Clear wishlist
  clearWishlist: async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${apiBaseUrl}/wishlist/clear`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ wishlist: [] });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },
}));
