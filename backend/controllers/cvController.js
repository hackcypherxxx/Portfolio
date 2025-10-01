import asyncHandler from 'express-async-handler';
import CV from '../models/CV.js';
import { generateCVPdf } from '../config/pdfGenerator.js';
import { uploadImages } from '../utils/uploadImages.js';

/**
 * Normalize uploaded image for Mongoose
 */
const normalizeImage = (img) => ({
  url: img.url,
  public_id: img.public_id
});

/**
 * Helper: Ensure arrays are proper objects
 */
const parseArrayField = (field) => {
  if (!field) return [];
  if (typeof field === 'string') {
    try {
      return JSON.parse(field);
    } catch {
      return [];
    }
  }
  return field;
};

/**
 * @desc    Create or update CV
 * @route   POST /api/cv
 * @access  Private (admin)
 */
export const upsertCV = asyncHandler(async (req, res) => {
  let cv = await CV.findOne();

  // Parse personal data from FormData (stringified JSON)
  let personalData = {};
  if (req.body.personal) {
    try {
      personalData = JSON.parse(req.body.personal);
    } catch {
      personalData = {};
    }
  }

  // Handle profilePic upload
  let profilePicData = cv?.personal?.profilePic || null;
  if (req.file) {
    const uploaded = await uploadImages([req.file], 'cv_profiles');
    profilePicData = normalizeImage(uploaded[0]);
  }

  // Build CV payload
  const payload = {
    personal: {
      name: personalData.name || '',
      title: personalData.title || '',
      email: personalData.email || '',
      phone: personalData.phone || '',
      address: personalData.address || '',
      website: personalData.website || '',
      summary: personalData.summary || '',
      socialLinks: parseArrayField(personalData.socialLinks),
      profilePic: profilePicData
    },
    experiences: parseArrayField(req.body.experiences),
    education: parseArrayField(req.body.education),
    projects: parseArrayField(req.body.projects),
    certifications: parseArrayField(req.body.certifications),
    skills: parseArrayField(req.body.skills),
    languages: parseArrayField(req.body.languages),
    interests: parseArrayField(req.body.interests),
    customSections: parseArrayField(req.body.customSections),
    theme: req.body.theme || 'default'
  };

  // Update existing CV or create new
  if (cv) {
    Object.assign(cv, payload);
    cv = await cv.save();
  } else {
    cv = await CV.create(payload);
  }

  res.status(200).json(cv);
});

/**
 * @desc    Get current CV
 * @route   GET /api/cv
 * @access  Public
 */
export const getCV = asyncHandler(async (req, res) => {
  const cv = await CV.findOne();
  if (!cv) {
    res.status(404);
    throw new Error('CV not found');
  }
  res.json(cv);
});

/**
 * @desc    Download CV as PDF
 * @route   GET /api/cv/download
 * @access  Public
 */
export const downloadCV = asyncHandler(async (req, res) => {
  const cv = await CV.findOne();
  if (!cv) {
    res.status(404);
    throw new Error('CV not found');
  }

  const pdfBuffer = await generateCVPdf(cv);
  res
    .header('Content-Type', 'application/pdf')
    .header('Content-Disposition', 'attachment; filename="resume.pdf"')
    .send(pdfBuffer);
});
