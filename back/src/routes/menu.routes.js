import express from 'express';
import { getMenuItems, createMenuItem, updateMenuItem, deleteMenuItem } from '../controllers/menu.controller.js';

const router = express.Router();

router.get('/', getMenuItems); //public route to get all menu items

router.post('/', createMenuItem); //admin route to create a new menu item

router.put('/:id', updateMenuItem); //admin route to update an existing menu item by ID

router.delete('/:id', deleteMenuItem); //admin route to delete a menu item by ID

export default router;