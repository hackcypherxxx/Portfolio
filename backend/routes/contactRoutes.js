import express from 'express';
import parser from '../config/multer.js';
import { sendContact } from '../controllers/contactController.js';

const router = express.Router();

// Accepts form-data: name, email, message, optional file=image
router.post('/', parser.single('image'), sendContact);

export default router;
