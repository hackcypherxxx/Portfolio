import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import parser from '../config/multer.js';
import { createReview, getReviews, updateReview, deleteReview } from '../controllers/reviewController.js';

const router = express.Router();

router.route('/')
  .get(getReviews)
  .post(protect, parser.single('image'), createReview);

router.route('/:id')
  .put(protect, parser.single('image'), updateReview)
  .delete(protect, deleteReview);

export default router;
