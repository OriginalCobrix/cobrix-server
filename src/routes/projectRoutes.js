import express from 'express';
import { 
  getProjects, 
  getProjectById, 
  getAllProjectsAdmin, 
  createProject, 
  updateProject, 
  deleteProject, 
  toggleFeatured 
} from '../controllers/projectController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getProjects);
router.get('/:id', getProjectById);

// Admin routes
router.get('/admin/all', protect, adminOnly, getAllProjectsAdmin);
router.post('/admin/create', protect, adminOnly, createProject);
router.put('/admin/update/:id', protect, adminOnly, updateProject);
router.delete('/admin/delete/:id', protect, adminOnly, deleteProject);
router.put('/admin/toggle-featured/:id', protect, adminOnly, toggleFeatured);

export default router;