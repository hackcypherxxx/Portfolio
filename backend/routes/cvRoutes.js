import express from 'express';
import parser from '../config/multer.js';
import { protect } from '../middleware/authMiddleware.js';
import {
  upsertCV,
  getCV,
  downloadCV
} from '../controllers/cvController.js';

const router = express.Router();

// Manage one CV instance (admin only)
router.route('/')
  .get(protect, getCV)
  .post(protect, parser.single('profilePic'), upsertCV);

// Export as PDF
router.get('/download', downloadCV);

export default router;
