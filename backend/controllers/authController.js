import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Generate JWT
const generateToken = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // required for https
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', // important for frontend-backend separate domains
    maxAge: 1000 * 60 * 60 * 24 * (process.env.JWT_COOKIE_EXPIRE || 7),
  });
};

// 📌 Seed/Register Admin (only once)
export const seedAdmin = asyncHandler(async (req, res) => {
  const { email, password, name } = req.body;

  // prevent multiple admins
  const existingAdmin = await User.findOne();
  if (existingAdmin) {
    res.status(400);
    throw new Error('Admin already exists');
  }

  const user = await User.create({ name, email, password, role: "admin" });

  if (user) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      email: user.email,
      name: user.name,
    });
  } else {
    res.status(400);
    throw new Error("Invalid admin data");
  }
});

// 📌 Login Admin
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  generateToken(res, user._id);

  res.json({
    message: 'Authenticated',
    _id: user._id,
    name: user.name,
    email: user.email,
  });
});

// 📌 Logout Admin
export const logout = (req, res) => {
  res.clearCookie('jwt', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
  });
  res.json({ message: 'Logged out' });
};
