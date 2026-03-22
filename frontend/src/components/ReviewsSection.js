import React, { useState, useEffect } from 'react';
import { FaStar, FaThumbsUp, FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useReviewStore } from '../store/reviewStore';
import { useAuthStore } from '../store/authStore';

export default function ReviewsSection({ productId }) {
  const { user, isLoggedIn } = useAuthStore();
  const { reviews, reviewStats, isLoading, fetchReviews, fetchReviewStats, addReview, markHelpful, deleteReview } = useReviewStore();
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('recent');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    rating: 5,
    title: '',
    comment: '',
    images: [],
  });

  useEffect(() => {
    fetchReviewStats(productId);
    fetchReviews(productId, page, sortBy);
  }, [productId, page, sortBy]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      toast.error('Please login to add a review');
      return;
    }

    const result = await addReview(productId, formData);
    if (result.success) {
      toast.success('Review added successfully!');
      setFormData({ rating: 5, title: '', comment: '', images: [] });
      setShowForm(false);
      fetchReviews(productId, 1, 'recent');
      fetchReviewStats(productId);
    } else {
      toast.error(result.error);
    }
  };

  const handleMarkHelpful = async (reviewId) => {
    if (!isLoggedIn) {
      toast.error('Please login to mark helpful');
      return;
    }
    const result = await markHelpful(reviewId);
    if (result.success) {
      toast.success('Marked as helpful!');
      fetchReviews(productId, page, sortBy);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      const result = await deleteReview(reviewId);
      if (result.success) {
        toast.success('Review deleted');
        fetchReviews(productId, page, sortBy);
        fetchReviewStats(productId);
      } else {
        toast.error(result.error);
      }
    }
  };

  return (
    <div className="mt-12 border-t pt-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>

      {/* Review Stats */}
      {reviewStats && (
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-bold text-gray-900">{reviewStats.average}</span>
                <span className="text-yellow-400 flex">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={i < Math.round(reviewStats.average) ? 'text-yellow-400' : 'text-gray-300'} />
                  ))}
                </span>
              </div>
              <p className="text-gray-600">Based on {reviewStats.total} reviews</p>
              <p className="text-sm text-gray-500 mt-1">{reviewStats.verifiedPurchases} verified purchases</p>
            </div>

            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 w-12">{rating}★</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400"
                      style={{ width: `${reviewStats.distribution[rating]}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">{reviewStats.distribution[rating]}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Review Button */}
      {isLoggedIn && !showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="mb-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Write a Review
        </button>
      )}

      {/* Review Form */}
      {showForm && (
        <form onSubmit={handleSubmitReview} className="bg-gray-50 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Share your thoughts</h3>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  className="text-2xl transition"
                >
                  <FaStar className={formData.rating >= star ? 'text-yellow-400' : 'text-gray-300'} />
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Summary of your review"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
            <textarea
              required
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              rows="4"
              placeholder="Share your experience with this product"
            ></textarea>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Submit Review
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-4 mb-6">
        {isLoading ? (
          <p className="text-gray-600">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-gray-600">No reviews yet. Be the first to review!</p>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-gray-900">{review.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-yellow-400 flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'} size={14} />
                      ))}
                    </span>
                    <span className="text-sm text-gray-600">{review.userName}</span>
                    {review.isVerifiedPurchase && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Verified Purchase</span>
                    )}
                  </div>
                </div>
                {isLoggedIn && user?.id === review.userId && (
                  <button
                    onClick={() => handleDeleteReview(review._id)}
                    className="text-red-600 hover:text-red-800 transition"
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
              <p className="text-gray-700 mb-3">{review.comment}</p>
              <button
                onClick={() => handleMarkHelpful(review._id)}
                className="text-sm text-gray-600 hover:text-blue-600 transition flex items-center gap-1"
              >
                <FaThumbsUp size={12} /> Helpful ({review.helpfulCount})
              </button>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {reviews.length > 0 && (
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">Page {page}</span>
          <button
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
