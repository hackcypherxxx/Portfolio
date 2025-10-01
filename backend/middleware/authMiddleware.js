import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

export const protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    res.status(401); throw new Error('Not authenticated');
  }
  try {
    const { id, role } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(id).select('-password');
    if (!user || role !== 'admin') {
      res.status(403); throw new Error('Forbidden');
    }
    req.user = user;
    next();
  } catch {
    res.status(401); throw new Error('Token invalid or expired');
  }
});
