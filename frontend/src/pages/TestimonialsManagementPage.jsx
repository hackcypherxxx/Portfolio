import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReviews, updateReview, deleteReview, createReview } from '../redux/slices/reviewSlice';
import { toast } from 'react-hot-toast';

const ACCENT = '#f9861a';

const TestimonialsPage = () => {
  const dispatch = useDispatch();
  const { items: allReviews, status, error } = useSelector(state => state.reviews);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [formData, setFormData] = useState({ name: '', message: '', image: null });

  useEffect(() => {
    if (status === 'idle') dispatch(fetchReviews());
  }, [status, dispatch]);

  // Open modal for create or edit
  const openModal = (review = null) => {
    setEditingReview(review);
    setFormData({
      name: review?.name || '',
      message: review?.message || '',
      image: null,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.message || (!formData.image && !editingReview)) {
      toast.error('⚠️ Name, message, and image are required!');
      return;
    }

    try {
      const form = new FormData();
      form.append('name', formData.name);
      form.append('message', formData.message);
      if (formData.image) form.append('image', formData.image);

      if (editingReview) {
        await dispatch(updateReview({ id: editingReview._id, formData: form })).unwrap();
        toast.success('✅ Review updated!');
      } else {
        await dispatch(createReview(form)).unwrap();
        toast.success('✅ Review created!');
      }

      setModalOpen(false);
      setEditingReview(null);
      setFormData({ name: '', message: '', image: null });
    } catch (err) {
      toast.error(`❌ Operation failed: ${err}`);
    }
  };

  const handleDelete = async (review) => {
    if (window.confirm(`Delete review from ${review.name}?`)) {
      try {
        await dispatch(deleteReview(review._id)).unwrap();
        toast.success(`🚮 Review from ${review.name} deleted.`);
      } catch (err) {
        toast.error(`❌ Error deleting review: ${err}`);
      }
    }
  };

  if (status === 'loading' && allReviews.length === 0) {
    return <div className="text-center py-10 text-gray-400">Loading testimonials...</div>;
  }

  if (status === 'failed' && allReviews.length === 0) {
    return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-10">
      {/* Header */}
      <div className="mb-4 flex justify-between items-center border-b border-gray-800 pb-4">
        <div>
          <h2 className="text-2xl font-bold">Testimonials</h2>
          <p className="text-gray-400">Manage reviews</p>
        </div>
        <button
          onClick={() => openModal()}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-semibold transition-colors shadow-md"
        >
          + Add
        </button>
      </div>

      {/* All Reviews */}
      {allReviews.length === 0 ? (
        <p className="text-gray-500 bg-[#07070e] p-6 rounded-xl border border-gray-800">
          No reviews found.
        </p>
      ) : (
        <ul className="divide-y divide-gray-800 bg-[#07070e] rounded-xl border border-gray-800 shadow-xl">
          {allReviews.map((review) => (
            <li key={review._id} className="p-6 transition-colors hover:bg-gray-900/50">
              <div className="flex justify-between items-center mb-3">
                <span className="font-extrabold text-white text-lg">{review.name}</span>
                <span className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="text-gray-400 italic mb-4 border-l-4 pl-4 border-gray-700">"{review.message}"</p>
              <div className="space-x-4 pt-2 flex items-center">
                <button
                  onClick={() => openModal(review)}
                  className="text-sm px-5 py-2 bg-blue-600 font-semibold hover:bg-blue-500 rounded-lg transition-colors shadow-md"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(review)}
                  className="text-sm px-5 py-2 bg-red-600 font-semibold hover:bg-red-500 rounded-lg transition-colors shadow-md"
                >
                  Delete
                </button>
                {review.image?.url && (
                  <a
                    href={review.image.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-400 hover:text-blue-300 transition-colors underline"
                  >
                    View Image
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-70 z-[1001] flex justify-center items-center p-4"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0b0a15] p-8 rounded-xl w-full max-w-lg border border-gray-800 shadow-2xl space-y-6"
            >
              <h3 className="text-2xl font-bold" style={{ color: ACCENT }}>
                {editingReview ? 'Edit Review' : 'Create New Review'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Author Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                  required
                />
                <textarea
                  placeholder="Message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows="4"
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                  required
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                  className="w-full p-3 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600 rounded-lg text-gray-400 bg-gray-800"
                  required={!editingReview}
                />
                <div className="flex justify-end space-x-3 pt-2">
                  <button type="button" onClick={() => setModalOpen(false)} className="px-5 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg text-white font-semibold">
                    Cancel
                  </button>
                  <button type="submit" className="px-5 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-white font-semibold">
                    {editingReview ? 'Update Review' : 'Create Review'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TestimonialsPage;
