import asyncHandler from 'express-async-handler';
import Category from '../models/Category.js';

export const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (await Category.findOne({ name })) {
    res.status(400);
    throw new Error('Category already exists');
  }
  const category = await Category.create({ name });
  res.status(201).json(category);
});

export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
});

export const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }
  category.name = req.body.name || category.name;
  const updated = await category.save();
  res.json(updated);
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }
  await category.remove();
  res.json({ message: 'Category deleted' });
});
