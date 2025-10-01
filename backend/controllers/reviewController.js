import asyncHandler from 'express-async-handler';
import Review from '../models/Review.js';
import { uploadImages } from '../utils/uploadImages.js';
import cloudinary from '../config/cloudinary.js';

// Create review
export const createReview = asyncHandler(async (req, res) => {
  let imageData = {};
  if (req.file) {
    const uploaded = await uploadImages([req.file]);
    imageData = uploaded[0];
  }

  const review = await Review.create({
    name: req.body.name,
    message: req.body.message,
    image: imageData
  });

  res.status(201).json(review);
});

// Get all reviews
export const getReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find().sort({ createdAt: -1 });
  res.json(reviews);
});

// Update review
export const updateReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) throw new Error('Review not found');

  if (req.file) {
    if (review.image?.publicId) {
      await cloudinary.uploader.destroy(review.image.publicId);
    }
    const uploaded = await uploadImages([req.file]);
    review.image = uploaded[0];
  }

  review.name = req.body.name || review.name;
  review.message = req.body.message || review.message;

  const updated = await review.save();
  res.json(updated);
});

// Delete review
export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) throw new Error('Review not found');

  if (review.image?.publicId) {
    await cloudinary.uploader.destroy(review.image.publicId);
  }

  await review.deleteOne();
  res.json({ message: 'Review deleted successfully' });
});
