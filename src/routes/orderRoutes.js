import express from 'express';
import { createOrder, getOrders, updateOrder, getUserOrders, getOrderById } from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.post('/', createOrder);
router.get('/', protect, getOrders);
router.get('/my-orders', protect, getUserOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id', protect, updateOrder);
export default router;