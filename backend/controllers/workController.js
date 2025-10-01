import asyncHandler from 'express-async-handler';
import Work from '../models/Work.js';
import { uploadImages } from '../utils/uploadImages.js';
import cloudinary from '../config/cloudinary.js';

/**
 * Normalize uploaded image for Mongoose
 */
const normalizeImage = (img) => ({
  url: img.url,
  public_id: img.publicId,
  alt: img.alt || 'Work image'
});

/**
 * @desc    Create a new Work
 * @route   POST /api/works
 * @access  Private
 */
export const createWork = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('Image file is required');
  }

  const uploaded = await uploadImages([req.file]);
  const imageData = normalizeImage(uploaded[0]);

  const work = await Work.create({
    title: req.body.title,
    description: req.body.description,
    category: req.body.category, // ObjectId
    image: imageData
  });

  res.status(201).json(work);
});

/**
 * @desc    Update a work
 * @route   PUT /api/works/:id
 * @access  Private
 */
export const updateWork = asyncHandler(async (req, res) => {
  const work = await Work.findById(req.params.id);
  if (!work) {
    res.status(404);
    throw new Error('Work not found');
  }

  // Update image if new file is uploaded
  if (req.file) {
    if (work.image?.public_id) {
      try {
        await cloudinary.uploader.destroy(work.image.public_id);
      } catch (err) {
        console.error('Cloudinary delete error:', err.message);
      }
    }
    const uploaded = await uploadImages([req.file]);
    work.image = normalizeImage(uploaded[0]);
  }

  work.title = req.body.title || work.title;
  work.description = req.body.description || work.description;
  work.category = req.body.category || work.category;

  const updated = await work.save();
  res.json(updated);
});

/**
 * @desc    Get all works
 * @route   GET /api/works
 * @access  Public
 */
export const getWorks = asyncHandler(async (req, res) => {
  const works = await Work.find().populate('category');
  res.json(works);
});

/**
 * @desc    Get single work by ID
 * @route   GET /api/works/:id
 * @access  Public
 */
export const getWorkById = asyncHandler(async (req, res) => {
  const work = await Work.findById(req.params.id).populate('category');
  if (!work) {
    res.status(404);
    throw new Error('Work not found');
  }
  res.json(work);
});

/**
 * @desc    Delete a work
 * @route   DELETE /api/works/:id
 * @access  Private
 */
export const deleteWork = asyncHandler(async (req, res) => {
  const work = await Work.findById(req.params.id);
  if (!work) {
    res.status(404);
    throw new Error('Work not found');
  }

  if (work.image?.public_id) {
    try {
      await cloudinary.uploader.destroy(work.image.public_id);
    } catch (err) {
      console.error('Cloudinary delete error:', err.message);
    }
  }

  await work.deleteOne();
  res.json({ message: 'Work deleted successfully' });
});
