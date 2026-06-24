import express from 'express';
import { createFeedback, getApprovedFeedback, getAllFeedback, updateFeedback, deleteFeedback } from '../controllers/feedbackController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();
router.post('/', createFeedback);
router.get('/', getApprovedFeedback);
router.get('/all', protect, adminOnly, getAllFeedback);
router.put('/:id', protect, adminOnly, updateFeedback);
router.delete('/:id', protect, adminOnly, deleteFeedback);
export default router;