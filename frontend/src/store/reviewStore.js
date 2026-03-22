import { create } from 'zustand';
import axios from 'axios';

const apiBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const useReviewStore = create((set, get) => ({
  reviews: [],
  reviewStats: null,
  isLoading: false,

  // Fetch reviews
  fetchReviews: async (productId, page = 1, sortBy = 'recent') => {
    set({ isLoading: true });
    try {
      const response = await axios.get(
        `${apiBaseUrl}/reviews/product/${productId}?page=${page}&sortBy=${sortBy}`
      );
      set({ reviews: response.data.reviews });
      return response.data;
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  // Fetch review stats
  fetchReviewStats: async (productId) => {
    try {
      const response = await axios.get(`${apiBaseUrl}/reviews/stats/${productId}`);
      set({ reviewStats: response.data.stats });
      return response.data.stats;
    } catch (error) {
      console.error('Error fetching review stats:', error);
      return null;
    }
  },

  // Add review
  addReview: async (productId, reviewData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${apiBaseUrl}/reviews`,
        { productId, ...reviewData },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return { success: true, review: response.data.review };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },

  // Mark as helpful
  markHelpful: async (reviewId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${apiBaseUrl}/reviews/helpful/${reviewId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },

  // Delete review
  deleteReview: async (reviewId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${apiBaseUrl}/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },
}));
