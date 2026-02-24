import express from 'express';
import { getMenuItems, createMenuItem, updateMenuItem, deleteMenuItem } from '../controllers/menu.controller.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getMenuItems); //public route to get all menu items

router.post('/', requireAuth, requireAdmin, createMenuItem); //admin route to create a new menu item

router.put('/:id', requireAuth, requireAdmin, updateMenuItem); //admin route to update an existing menu item by ID

router.delete('/:id', requireAuth, requireAdmin, deleteMenuItem); //admin route to delete a menu item by ID

export default router;