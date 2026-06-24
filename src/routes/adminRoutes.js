import express from 'express';
import { getStats, getUsers } from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(protect, adminOnly);
router.get('/stats', getStats);
router.get('/users', getUsers);
export default router;