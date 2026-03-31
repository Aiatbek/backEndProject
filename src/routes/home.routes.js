import express from 'express';
import { getHomeInfo, updateHomeInfo} from '../controllers/home.controller.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getHomeInfo);
router.put('/', requireAuth, requireAdmin, updateHomeInfo);

export default router;