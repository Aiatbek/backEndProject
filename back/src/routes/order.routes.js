import express from 'express';
import { createOrder, getMyOrders, getAllOrders, updateOrderStatus } from '../controllers/order.controller.js';
import getOrderStats from "../controllers/ordersStats.controller.js";
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// NOTE: specific routes (/my, /admin, /stats) MUST come before /:id
// otherwise Express treats "my", "admin", "stats" as order IDs

router.post('/',              requireAuth,                createOrder);       // place order
router.get('/my',             requireAuth,                getMyOrders);       // customer: own orders
router.get('/admin',          requireAuth, requireAdmin,  getAllOrders);       // admin: all orders
router.get('/stats',          requireAuth, requireAdmin,  getOrderStats);     // admin: stats
router.patch('/:id/status',   requireAuth, requireAdmin,  updateOrderStatus); // admin: update status

export default router;
