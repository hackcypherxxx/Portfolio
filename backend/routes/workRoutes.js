import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import parser from '../config/multer.js'; // Multer config
import {
  createWork,
  updateWork,
  getWorks,
  getWorkById,
  deleteWork
} from '../controllers/workController.js';

const router = express.Router();

router.route('/')
  .get(getWorks)
  .post(protect, parser.single('file'), createWork);

router.route('/:id')
  .put(protect, parser.single('file'), updateWork)
  .delete(protect, deleteWork);

export default router;
