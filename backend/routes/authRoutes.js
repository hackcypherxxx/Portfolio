import express from 'express';
import { seedAdmin, login, logout } from '../controllers/authController.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Protect seed in prod or remove after first run
router.post('/seed', seedAdmin);

router.post('/login', authLimiter, login);
router.post('/logout', logout);

export default router;
