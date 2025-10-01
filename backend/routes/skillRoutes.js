import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createSkill,
  getSkills,
  getSkillById,
  updateSkill,
  increaseSkill,
  decreaseSkill,
  deleteSkill
} from '../controllers/skillController.js';

const router = express.Router();

router.route('/')
  .get(getSkills)
  .post(protect, createSkill);

router.route('/:id')
  .get(protect, getSkillById)
  .put(protect, updateSkill)
  .delete(protect, deleteSkill);

router.route('/:id/increase')
  .patch(protect, increaseSkill);

router.route('/:id/decrease')
  .patch(protect, decreaseSkill);

export default router;
