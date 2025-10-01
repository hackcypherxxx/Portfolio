import asyncHandler from 'express-async-handler';
import Skill from '../models/Skill.js';
import Category from '../models/Category.js'; // Assuming category model exists

// Create a new skill
export const createSkill = asyncHandler(async (req, res) => {
  const { name, level, category } = req.body;

  if (!name) {
    res.status(400);
    throw new Error('Skill name is required');
  }

  if (await Skill.findOne({ name })) {
    res.status(400);
    throw new Error('Skill already exists');
  }

  let categoryDoc = null;
  if (category) {
    categoryDoc = await Category.findById(category);
    if (!categoryDoc) {
      res.status(400);
      throw new Error('Invalid category');
    }
  }

  const skill = await Skill.create({
    name,
    level: level || 0,
    category: categoryDoc ? categoryDoc._id : undefined,
  });

  res.status(201).json(skill);
});

// Get all skills (populate category for clarity)
export const getSkills = asyncHandler(async (req, res) => {
  const skills = await Skill.find()
    .populate('category', 'name') // populate category name only
    .sort({ createdAt: -1 });

  res.json(skills);
});

// Get a single skill by ID
export const getSkillById = asyncHandler(async (req, res) => {
  const skill = await Skill.findById(req.params.id).populate('category', 'name');
  if (!skill) {
    res.status(404);
    throw new Error('Skill not found');
  }
  res.json(skill);
});

// Update skill name, level, or category
export const updateSkill = asyncHandler(async (req, res) => {
  const { name, level, category } = req.body;
  const skill = await Skill.findById(req.params.id);

  if (!skill) {
    res.status(404);
    throw new Error('Skill not found');
  }

  if (name) skill.name = name;
  if (typeof level !== 'undefined') skill.level = level;

  if (category) {
    const categoryDoc = await Category.findById(category);
    if (!categoryDoc) {
      res.status(400);
      throw new Error('Invalid category');
    }
    skill.category = categoryDoc._id;
  }

  const updated = await skill.save();
  res.json(updated);
});

// Increase skill level by an amount (default 1)
export const increaseSkill = asyncHandler(async (req, res) => {
  const increment = parseInt(req.body.amount, 10) || 1;
  const skill = await Skill.findById(req.params.id);

  if (!skill) {
    res.status(404);
    throw new Error('Skill not found');
  }

  skill.level = Math.min(skill.level + increment, 100);
  const updated = await skill.save();
  res.json(updated);
});

// Decrease skill level by an amount (default 1)
export const decreaseSkill = asyncHandler(async (req, res) => {
  const decrement = parseInt(req.body.amount, 10) || 1;
  const skill = await Skill.findById(req.params.id);

  if (!skill) {
    res.status(404);
    throw new Error('Skill not found');
  }

  skill.level = Math.max(skill.level - decrement, 0);
  const updated = await skill.save();
  res.json(updated);
});

// Delete a skill
export const deleteSkill = asyncHandler(async (req, res) => {
  const skill = await Skill.findById(req.params.id);
  if (!skill) {
    res.status(404);
    throw new Error('Skill not found');
  }

  await skill.deleteOne();
  res.json({ message: 'Skill deleted' });
});
