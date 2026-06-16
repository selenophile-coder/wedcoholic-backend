import express from 'express';
import { 
  createOrder, 
  getOrders, 
  getOrderAnalytics, 
  updateOrderStatus, 
  deleteOrder, 
  clearAllOrders,
  trackOrder,
  getMyOrders
} from '../controllers/orderController.js';
import { protect, adminOnly, optionalProtect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/myorders', protect, getMyOrders);
router.get('/track/:id', optionalProtect, trackOrder);

router.route('/')
  .post(optionalProtect, createOrder)
  .get(protect, adminOnly, getOrders)
  .delete(protect, adminOnly, clearAllOrders);

router.get('/analytics', protect, adminOnly, getOrderAnalytics);

router.route('/:id')
  .delete(protect, adminOnly, deleteOrder);

router.route('/:id/status')
  .put(protect, adminOnly, updateOrderStatus);

export default router;
