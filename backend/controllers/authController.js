import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
 
// Seed or register admin (run once)
export const seedAdmin = asyncHandler(async (req, res) => {
  const { email, password, name } = req.body;
  if (await User.findOne({ email })) {
    res.status(400); throw new Error('Admin already exists');
  }
  const user = await User.create({ name, email, password });
  res.status(201).json({ email: user.email, name: user.name });
});

// Login admin
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password, user.password))) {
    res.status(401); throw new Error('Invalid credentials');
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 1000 * 60 * 60 * 24 * process.env.JWT_COOKIE_EXPIRE
  });

  res.json({ message: 'Authenticated' });
});

// Logout admin
export const logout = (req, res) => {
  res.clearCookie('jwt');
  res.json({ message: 'Logged out' });
};
