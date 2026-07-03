import express from 'express';
import { getProfiles, createProfile, deleteProfile } from '../controllers/profileController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getProfiles);
router.post('/', protect, createProfile);
router.delete('/:id', protect, deleteProfile);

export default router;